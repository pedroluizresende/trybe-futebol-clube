export interface INewMatch {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
}

interface IMatch extends INewMatch{
  id: number;
  inProgress: boolean;
}

export interface IMatchWithTeamName extends IMatch {
  homeTeam: {
    teamName: string
  },
  awayTeam: {
    teamName: string
  },
}

export default IMatch;
