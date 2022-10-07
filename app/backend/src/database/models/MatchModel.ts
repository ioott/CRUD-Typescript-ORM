import { INTEGER, BOOLEAN, Model } from 'sequelize';
import Team from './TeamModel';
import db from '.';

class Match extends Model {
  id!: number;
  homeTeam!: number;
  homeTeamGoals!: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress!: boolean;
}

Match.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Team.belongsTo(Match, { foreignKey: 'teamName', as: 'teamName' });
Match.hasMany(Team, { foreignKey: 'homeTeam', as: 'homeTeam' });
Match.hasMany(Team, { foreignKey: 'awayTeam', as: 'awayTeam' });

export default Match;
