// import Team from '../database/models/TeamModel';
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
}

export default MatchService;
