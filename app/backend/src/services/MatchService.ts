import UnprocessingException from '../exceptions/UnprocessingException';
import NotFoundException from '../exceptions/NotFoundException';
import MatchModel from '../database/models/MatchModel';
import IMatch, { IMatchWithTeamName, INewMatch } from '../database/interfaces/IMatch';
import Team from '../database/models/TeamModel';
import TeamService from './TeamService';

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

  static async findById(id:number): Promise<IMatchWithTeamName> {
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

    if (!match) throw new NotFoundException('match not found');
    return match;
  }

  static async update(
    id:number,
    homeTeamGoals:number,
    awayTeamGoals:number,
  ): Promise<number> {
    await MatchModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    const updatedMatch = await MatchService.findById(id);
    if (!updatedMatch) {
      throw new NotFoundException('Match Not Found');
    }
    return updatedMatch.id;
  }

  private static async verifyIds(homeTeamId: number, awayTeamId: number):Promise<void> {
    if (homeTeamId === awayTeamId) {
      throw new UnprocessingException('It is not possible to create a match with two equal teams');
    }
    const homeTeam = await TeamService.getById(homeTeamId);
    const awayTeam = await TeamService.getById(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new NotFoundException('There is no team with such id!');
    }
  }

  static async create(newMatch: INewMatch): Promise<IMatch> {
    const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = newMatch;

    await MatchService.verifyIds(homeTeamId, awayTeamId);

    const { id } = await MatchModel.create({
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress: true,
    });
    return {
      id,
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress: true,
    };
  }
}
export default MatchService;
