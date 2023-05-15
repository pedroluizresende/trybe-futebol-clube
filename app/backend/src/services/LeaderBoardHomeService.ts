import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';
import { ITeamLeaderboard } from './interfaces/ITeamLeaderboard';

class LeaderboardHomeService {
  private static async getTeams(): Promise<Team[]> {
    return Team.findAll();
  }

  private static async getMatches(homeTeamId:number): Promise<MatchModel[]> {
    const matches = await MatchModel.findAll({
      where: { homeTeamId, inProgress: false },
    });

    return matches;
  }

  private static async getGoalFavor(homeTeamId:number): Promise<number> {
    const matches = await LeaderboardHomeService.getMatches(homeTeamId);
    const goals = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    return goals;
  }

  private static async getGoalsOwn(homeTeamId:number):Promise<number> {
    const matches = await LeaderboardHomeService.getMatches(homeTeamId);
    const goals = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    return goals;
  }

  private static async getTotalVictories(homeTeamId:number): Promise<number> {
    const matches = await LeaderboardHomeService.getMatches(homeTeamId);
    const filteredMatch = matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalDraws(homeTeamId:number): Promise<number> {
    const matches = await LeaderboardHomeService.getMatches(homeTeamId);
    const filteredMatch = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalLosses(homeTeamId:number): Promise<number> {
    const matches = await LeaderboardHomeService.getMatches(homeTeamId);
    const filteredMatch = matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalPoints(homeTeamId:number): Promise<number> {
    const victoriesPoints = await LeaderboardHomeService.getTotalVictories(homeTeamId) * 3;
    const drawsPoinst = await LeaderboardHomeService.getTotalDraws(homeTeamId);

    return victoriesPoints + drawsPoinst;
  }

  private static async calculateGoalsBalance(teamId: number):Promise<number> {
    const goalsFavor = await LeaderboardHomeService.getGoalFavor(teamId);
    const goalsOwn = await LeaderboardHomeService.getGoalsOwn(teamId);
    return goalsFavor - goalsOwn;
  }

  private static async calculateEficiency(teamId:number): Promise<number> {
    const games = (await LeaderboardHomeService.getMatches(teamId)).length;
    const points = await LeaderboardHomeService.getTotalPoints(teamId);
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
    const teams = await LeaderboardHomeService.getTeams();
    const response = await Promise.all(
      teams.map(async (team) => ({
        name: team.teamName,
        totalPoints: await LeaderboardHomeService.getTotalPoints(team.id),
        totalGames: (await LeaderboardHomeService.getMatches(team.id)).length,
        totalVictories: await LeaderboardHomeService.getTotalVictories(team.id),
        totalDraws: await LeaderboardHomeService.getTotalDraws(team.id),
        totalLosses: await LeaderboardHomeService.getTotalLosses(team.id),
        goalsFavor: await LeaderboardHomeService.getGoalFavor(team.id),
        goalsOwn: await LeaderboardHomeService.getGoalsOwn(team.id),
        goalsBalance: await LeaderboardHomeService.calculateGoalsBalance(team.id),
        efficiency: await LeaderboardHomeService.calculateEficiency(team.id),
      })),
    );

    const sortedLeaderboard = LeaderboardHomeService.sortLeaderboard(response);
    return sortedLeaderboard;
  }
}

export default LeaderboardHomeService;
