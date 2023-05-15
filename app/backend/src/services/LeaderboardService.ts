import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';
import { ITeamLeaderboard } from './interfaces/ITeamLeaderboard';

class LeaderboardService {
  private static async getTeams(): Promise<Team[]> {
    return Team.findAll();
  }

  private static async getMatches(teamId:number): Promise<MatchModel[]> {
    const matchesHome = await MatchModel.findAll({
      where: { homeTeamId: teamId, inProgress: false },
    });

    const matchesAway = await MatchModel.findAll({
      where: { awayTeamId: teamId, inProgress: false },
    });

    return [...matchesHome, ...matchesAway];
  }

  private static async getGoalFavor(teamId:number): Promise<number> {
    const matches = await LeaderboardService.getMatches(teamId);
    const goals = matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) {
        return acc + match.homeTeamGoals;
      }
      return acc + match.awayTeamGoals;
    }, 0);
    return goals;
  }

  private static async getGoalsOwn(teamId:number):Promise<number> {
    const matches = await LeaderboardService.getMatches(teamId);
    const goals = matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) {
        return acc + match.awayTeamGoals;
      }
      return acc + match.homeTeamGoals;
    }, 0);
    return goals;
  }

  private static async getTotalVictories(teamId:number): Promise<number> {
    const matches = await LeaderboardService.getMatches(teamId);
    const filteredMatch = matches.filter((match) => {
      if (match.homeTeamId === teamId) {
        return match.homeTeamGoals > match.awayTeamGoals;
      }
      return match.homeTeamGoals < match.awayTeamGoals;
    });
    return filteredMatch.length;
  }

  private static async getTotalDraws(teamId:number): Promise<number> {
    const matches = await LeaderboardService.getMatches(teamId);
    const filteredMatch = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalLosses(teamId:number): Promise<number> {
    const matches = await LeaderboardService.getMatches(teamId);
    const filteredMatch = matches.filter((match) => {
      if (match.homeTeamId === teamId) {
        return match.homeTeamGoals < match.awayTeamGoals;
      }
      return match.homeTeamGoals > match.awayTeamGoals;
    });
    return filteredMatch.length;
  }

  private static async getTotalPoints(teamId:number): Promise<number> {
    const victoriesPoints = await LeaderboardService.getTotalVictories(teamId) * 3;
    const drawsPoinst = await LeaderboardService.getTotalDraws(teamId);

    return victoriesPoints + drawsPoinst;
  }

  private static async calculateGoalsBalance(teamId:number):Promise<number> {
    const goalsFavor = await LeaderboardService.getGoalFavor(teamId);
    const goalsOwn = await LeaderboardService.getGoalsOwn(teamId);
    return goalsFavor - goalsOwn;
  }

  private static async calculateEficiency(teamId:number): Promise<number> {
    const games = (await LeaderboardService.getMatches(teamId)).length;
    const points = await LeaderboardService.getTotalPoints(teamId);
    const totalPossiblePoints = games * 3;
    const efficiency = (points / totalPossiblePoints) * 100;

    return parseFloat(efficiency.toFixed(2));
  }

  private static sortLeaderboard(leaderboard: ITeamLeaderboard[]): ITeamLeaderboard[] {
    const sortedLeaderboard = leaderboard.sort((a, b) => {
      if (b.totalPoints === a.totalPoints) {
        if (b.totalVictories === a.totalVictories) {
          if (b.goalsBalance === a.goalsBalance) {
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalVictories - a.totalVictories;
      }
      return b.totalPoints - a.totalPoints;
    });

    return sortedLeaderboard;
  }

  static async getLeaderBoard(): Promise<ITeamLeaderboard[]> {
    const teams = await LeaderboardService.getTeams();
    const response = await Promise.all(
      teams.map(async (team) => ({
        name: team.teamName,
        totalPoints: await LeaderboardService.getTotalPoints(team.id),
        totalGames: (await LeaderboardService.getMatches(team.id)).length,
        totalVictories: await LeaderboardService.getTotalVictories(team.id),
        totalDraws: await LeaderboardService.getTotalDraws(team.id),
        totalLosses: await LeaderboardService.getTotalLosses(team.id),
        goalsFavor: await LeaderboardService.getGoalFavor(team.id),
        goalsOwn: await LeaderboardService.getGoalsOwn(team.id),
        goalsBalance: await LeaderboardService.calculateGoalsBalance(team.id),
        efficiency: await LeaderboardService.calculateEficiency(team.id),
      })),
    );

    const sortedLeaderboard = LeaderboardService.sortLeaderboard(response);
    return sortedLeaderboard;
  }
}

export default LeaderboardService;
