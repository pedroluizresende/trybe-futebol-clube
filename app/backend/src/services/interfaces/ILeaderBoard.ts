import MatchModel from '../../database/models/MatchModel';
import Team from '../../database/models/TeamModel';
import { ITeamLeaderboard } from './ITeamLeaderboard';

export interface ILeaderBoard {
  getTeams():Promise<Team[]>
  getMatches(homeTeamId:number): Promise<MatchModel[]>
  getGoalFavor(homeTeamId:number): Promise<number>
  getGoalsOwn(homeTeamId:number): Promise<number>
  getTotalVictories(homeTeamId:number):Promise<number>
  getTotalDraws(homeTeamId:number):Promise<number>
  getTotalLosses(homeTeamId:number): Promise<number>
  getTotalPoints(homeTeamId:number): Promise<number>
  calculateGoalsBalance(teamId: number):Promise<number>
  calculateEficiency(teamId:number): Promise<number>
  sortLeaderboard(leaderboard: ITeamLeaderboard[]): ITeamLeaderboard[]
}
