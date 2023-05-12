import { match } from "assert";
import IMatch ,{INewMatch} from "../../database/interfaces/IMatch";
import MatchModel from "../../database/models/MatchModel";


export const matchesMock: IMatch[] = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false
  },
  {
    id: 2,
    homeTeamId: 2,
    homeTeamGoals: 3,
    awayTeamId: 9,
    awayTeamGoals: 1,
    inProgress: false
  },
];

export const matchesMockWhithTeamName = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
      teamName: 'São Paulo'
    },
    awayTeam: {
      teamName: 'Grêmio'
    }
  },
  {
    id: 2,
    homeTeamId: 2,
    homeTeamGoals: 3,
    awayTeamId: 9,
    awayTeamGoals: 1,
    inProgress: true,
    homeTeam: {
      teamName: 'São Paulo'
    },
    awayTeam: {
      teamName: 'Internacional'
    }
  },
];

export const newMatch: INewMatch = {
    homeTeamId: 16,
    homeTeamGoals: 8,
    awayTeamId: 2,
    awayTeamGoals: 2,
}