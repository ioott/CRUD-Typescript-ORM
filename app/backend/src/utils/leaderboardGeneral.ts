import Team, { Matches } from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';
import {
  calcTotalPointsHome,
  calcTotalVictoriesHome,
  calcTotalDraws,
  calcTotalLossesHome,
  calcGoalsFavorHome,
  calcGoalsOwnHome,
  calcGoalsBalanceHome,
} from './leaderboardHome';
import {
  calcTotalPointsAway,
  calcTotalVictoriesAway,
  calcTotalLossesAway,
  calcGoalsFavorAway,
  calcGoalsOwnAway,
  calcGoalsBalanceAway,
} from './leaderboardAway';

const newLeaderboardGeneral = (
  name: string,
  dataHomeMatches: Matches[],
  dataAwayMatches: Matches[],
) => {
  const data = { name,
    totalPoints: calcTotalPointsHome(dataHomeMatches) + calcTotalPointsAway(dataAwayMatches),
    totalGames: dataHomeMatches.length + dataAwayMatches.length,
    totalVictories: calcTotalVictoriesHome(dataHomeMatches)
      + calcTotalVictoriesAway(dataAwayMatches),
    totalDraws: calcTotalDraws(dataHomeMatches) + calcTotalDraws(dataAwayMatches),
    totalLosses: calcTotalLossesHome(dataHomeMatches) + calcTotalLossesAway(dataAwayMatches),
    goalsFavor: calcGoalsFavorHome(dataHomeMatches) + calcGoalsFavorAway(dataAwayMatches),
    goalsOwn: calcGoalsOwnHome(dataHomeMatches) + calcGoalsOwnAway(dataAwayMatches),
    goalsBalance: calcGoalsBalanceHome(dataHomeMatches) + calcGoalsBalanceAway(dataAwayMatches),
    efficiency: Number((((calcTotalPointsHome(dataHomeMatches)
      + calcTotalPointsAway(dataAwayMatches)) / ((dataHomeMatches.length
        + dataAwayMatches.length) * 3)) * 100).toFixed(2)),
  }; return data;
};

const orderedLeaderboard = (leaderboard: Ileaderboard[]) => {
  const finalLeaderboard = leaderboard.sort((prev, curr) => (
    curr.totalPoints - prev.totalPoints
    || curr.totalVictories - prev.totalVictories
    || curr.goalsBalance - prev.goalsBalance
    || curr.goalsFavor - prev.goalsFavor
    || curr.goalsOwn - prev.goalsOwn));
  return finalLeaderboard;
};

const calcGeneralTeam = (dataTeams: Team[]) => {
  const generalLeaderboard = dataTeams.map((team) => (
    newLeaderboardGeneral(team.teamName, team.teamHome as Matches[], team.teamAway as Matches[])
  ));
  orderedLeaderboard(generalLeaderboard);

  return generalLeaderboard;
};

export default calcGeneralTeam;
