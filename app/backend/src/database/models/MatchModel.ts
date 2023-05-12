import { Model, INTEGER, BOOLEAN } from 'sequelize';
import IMatch from '../interfaces/IMatch';
import db from '.';
import Team from './TeamModel';

class MatchModel extends Model implements IMatch {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamdGoals: number;
  declare awayTeamId: number;
  declare awayTeamdGoals: number;
  declare inProgress: boolean;
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
  homeTeamdGoals: {
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
  awayTeamdGoals: {
    type: INTEGER,
  },
  inProgress: {
    allowNull: false,
    type: BOOLEAN,
  },
}, {
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
  underscored: true,
});

MatchModel.hasOne(Team, { foreignKey: 'id', as: 'homeTeam' });
MatchModel.hasOne(Team, { foreignKey: 'id', as: 'awayTeam' });

Team.hasMany(MatchModel, { foreignKey: 'homeTeamId', as: 'away matches' });
Team.hasMany(MatchModel, { foreignKey: 'awayTeamId', as: 'home matches' });

export default MatchModel;
