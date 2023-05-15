import IMatch from "../../database/interfaces/IMatch";
import { ITeamLeaderboard } from "../../services/interfaces/ITeamLeaderboard";

type ITeam = {
  id: number;
  teamName: string
}

export const teamsMock: ITeam[] = [
 {
  id: 1,
  teamName: 'Palmeiras',
 },
 {
  id: 2,
  teamName: 'Grêmio'
 }
]

export const matchMock: IMatch = {
  id: 1,
  homeTeamId: 1,
  homeTeamGoals: 4,
  awayTeamId: 2,
  awayTeamGoals: 3,
  inProgress: false
}

export const leaderBoardMock: ITeamLeaderboard[] = [{
  name: teamsMock[1].teamName,
  totalPoints: 3,
  totalGames: 1,
  totalVictories: 1,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 4,
  goalsOwn: 1,
},
{
  name: teamsMock[2].teamName,
  totalPoints: 0,
  totalGames: 1,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 1,
  goalsFavor: 1,
  goalsOwn: 4,
},
]