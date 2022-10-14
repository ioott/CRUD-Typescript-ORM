import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';

type Matches = {
  homeTeamGoals?: number;
  awayTeamGoals?: number;
};

class Team extends Model {
  id!: number;
  teamName!: string;
  teamHome?: Matches[];
  teamAway?: Matches[];
}

Team.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default Team;
export { Matches };
