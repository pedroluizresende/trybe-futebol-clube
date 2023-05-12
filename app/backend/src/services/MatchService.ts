import MatchModel from '../database/models/MatchModel';
import { IMatchWithTeamName } from '../database/interfaces/IMatch';
import Team from '../database/models/TeamModel';

class MatchService {
  static async getAll(): Promise<IMatchWithTeamName[]> {
    const matchs = MatchModel.findAll({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        { model: Team,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });

    return matchs;
  }

  static async matchesFilteredByInProgress(inProgress:string):Promise<IMatchWithTeamName[]> {
    let status;

    if (inProgress === 'true') status = true;
    if (inProgress === 'false') status = false;
    const matchs = MatchModel.findAll({
      where: { inProgress: status },
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        { model: Team,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
    });
    return matchs;
  }

  static async updateInProgress(id: number): Promise<string> {
    await MatchModel.update(
      { inProgress: false },
      { where: { id } },
    );

    return 'Finished';
  }

  static async findById(id:number): Promise<IMatchWithTeamName | null> {
    const match = await MatchModel.findOne({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: { exclude: ['id'] },
        },
        { model: Team,
          as: 'awayTeam',
          attributes: { exclude: ['id'] },
        },
      ],
      where: { id },
    });
    return match;
  }

  static async update(
    id:number,
    homeTeamGoals:number,
    awayTeamGoals:number,
  ): Promise<IMatchWithTeamName | null> {
    console.log(await MatchModel.findOne({ where: { id } }));

    await MatchModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    const updatedMatch = MatchService.findById(id);
    return updatedMatch;
  }
}
export default MatchService;
