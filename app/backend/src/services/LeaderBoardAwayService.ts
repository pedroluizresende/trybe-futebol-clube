import MatchModel from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';
import { ITeamLeaderboard } from './interfaces/ITeamLeaderboard';

class LeaderboardAwayService {
  private static async getTeams(): Promise<Team[]> {
    return Team.findAll();
  }

  private static async getMatches(awayTeamId:number): Promise<MatchModel[]> {
    const matches = await MatchModel.findAll({
      where: { awayTeamId, inProgress: false },
    });

    return matches;
  }

  private static async getGoalFavor(awayTeamId:number): Promise<number> {
    const matches = await LeaderboardAwayService.getMatches(awayTeamId);
    const goals = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    return goals;
  }

  private static async getGoalsOwn(awayTeamId:number):Promise<number> {
    const matches = await LeaderboardAwayService.getMatches(awayTeamId);
    const goals = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    return goals;
  }

  private static async getTotalVictories(awayTeamId:number): Promise<number> {
    const matches = await LeaderboardAwayService.getMatches(awayTeamId);
    const filteredMatch = matches.filter((match) => match.awayTeamGoals > match.homeTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalDraws(awayTeamId:number): Promise<number> {
    const matches = await LeaderboardAwayService.getMatches(awayTeamId);
    const filteredMatch = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalLosses(awayTeamId:number): Promise<number> {
    const matches = await LeaderboardAwayService.getMatches(awayTeamId);
    const filteredMatch = matches.filter((match) => match.awayTeamGoals < match.homeTeamGoals);
    return filteredMatch.length;
  }

  private static async getTotalPoints(awayTeamId:number): Promise<number> {
    const victoriesPoints = await LeaderboardAwayService.getTotalVictories(awayTeamId) * 3;
    const drawsPoinst = await LeaderboardAwayService.getTotalDraws(awayTeamId);

    return victoriesPoints + drawsPoinst;
  }

  private static async calculateGoalsBalance(teamId: number):Promise<number> {
    const goalsFavor = await LeaderboardAwayService.getGoalFavor(teamId);
    const goalsOwn = await LeaderboardAwayService.getGoalsOwn(teamId);
    return goalsFavor - goalsOwn;
  }

  private static async calculateEficiency(teamId:number): Promise<number> {
    const games = (await LeaderboardAwayService.getMatches(teamId)).length;
    const points = await LeaderboardAwayService.getTotalPoints(teamId);
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
    const teams = await LeaderboardAwayService.getTeams();
    const response = await Promise.all(
      teams.map(async (team) => ({
        name: team.teamName,
        totalPoints: await LeaderboardAwayService.getTotalPoints(team.id),
        totalGames: (await LeaderboardAwayService.getMatches(team.id)).length,
        totalVictories: await LeaderboardAwayService.getTotalVictories(team.id),
        totalDraws: await LeaderboardAwayService.getTotalDraws(team.id),
        totalLosses: await LeaderboardAwayService.getTotalLosses(team.id),
        goalsFavor: await LeaderboardAwayService.getGoalFavor(team.id),
        goalsOwn: await LeaderboardAwayService.getGoalsOwn(team.id),
        goalsBalance: await LeaderboardAwayService.calculateGoalsBalance(team.id),
        efficiency: await LeaderboardAwayService.calculateEficiency(team.id),
      })),
    );

    const sortedLeaderboard = LeaderboardAwayService.sortLeaderboard(response);
    return sortedLeaderboard;
  }
}

export default LeaderboardAwayService;
