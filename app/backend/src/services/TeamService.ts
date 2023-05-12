import Team from '../database/models/TeamModel';

export default class TeamService {
  static async getAll(): Promise<Team[]> {
    const teams = await Team.findAll();

    return teams;
  }

  static async getById(id:number): Promise<Team | null> {
    const team = await Team.findOne({
      where: { id },
    });

    return team;
  }
}
