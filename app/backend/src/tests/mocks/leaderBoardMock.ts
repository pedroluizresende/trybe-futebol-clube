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

export const teamsMock2: ITeam[] = [
  {
   id: 2,
   teamName: 'Grêmio',
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
  goalsBalance: 3,
  efficiency: 100,
}
]

export const leaderBoardMock2: ITeamLeaderboard[] = [{
  name: 'Grêmio',
  totalPoints: 0,
  totalGames: 1,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 1,
  goalsFavor: 1,
  goalsOwn: 4,
  goalsBalance: -3,
  efficiency: 0,
}
]

export const leaderBoardMock3: ITeamLeaderboard[] = [{
  name: 'Palmeiras',
  totalPoints: 6,
  totalGames: 2,
  totalVictories: 2,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 8,
  goalsOwn: 2,
  goalsBalance: 6,
  efficiency: 100,
}]