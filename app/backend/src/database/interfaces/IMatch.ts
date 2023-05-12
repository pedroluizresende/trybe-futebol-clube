interface IMatch {
  id: number;
  homeTeamId: number;
  homeTeamdGoals: number;
  awayTeamId: number;
  awayTeamdGoals: number;
  inProgress: boolean;
}

export default IMatch;
