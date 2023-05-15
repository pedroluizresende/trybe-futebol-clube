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
]

export const matchMock: IMatch[] = [
  {
  id: 1,
  homeTeamId: 1,
  homeTeamGoals: 4,
  awayTeamId: 2,
  awayTeamGoals: 1,
  inProgress: false
},
]

export const leaderBoardMock: ITeamLeaderboard[] = [{
  name: 'Palmeiras',
  totalPoints: 3,
  totalGames: 1,
  totalVictories: 1,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 4,
  goalsOwn: 1,
}
]