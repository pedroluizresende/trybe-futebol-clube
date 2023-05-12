import { Model, INTEGER, BOOLEAN } from 'sequelize';
import IMatch from '../interfaces/IMatch';
import db from '.';
import Team from './TeamModel';

class MatchModel extends Model implements IMatch {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
  declare homeTeam: Team;
  declare awayTeam: Team;

  static async getAll() {
    return this.findAll({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
      ],
    });
  }
}

MatchModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  homeTeamGoals: {
    type: INTEGER,
  },
  awayTeamId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'teams',
      key: 'id',
    },
  },
  awayTeamGoals: {
    type: INTEGER,
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
  underscored: true,
});

MatchModel.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
MatchModel.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

Team.hasMany(MatchModel, { foreignKey: 'homeTeamId', as: 'homeMatches' });
Team.hasMany(MatchModel, { foreignKey: 'awayTeamId', as: 'awayMatches' });

export default MatchModel;
