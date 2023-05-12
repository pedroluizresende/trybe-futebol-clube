import { STRING, INTEGER, Model } from 'sequelize';
import db from '.';

class User extends Model {
  declare id: number;
  declare username: string;
  declare role:string;
  declare email:string;
  declare password: string;
}

User.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    allowNull: false,
    type: STRING,
  },
  role: {
    type: STRING,
  },
  email: {
    allowNull: false,
    type: STRING,
  },
  password: {
    allowNull: false,
    type: STRING,
  },
}, {
  sequelize: db,
  modelName: 'users',
  timestamps: false,
  underscored: true,
});

export default User;
