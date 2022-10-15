import Team, { Matches } from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';

const calcTotalPointsHome = (matches: Matches[]) => {
  let points = 0;
  const totalPoints = matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return 0;
    }
    if (match.awayTeamGoals === match.homeTeamGoals) {
      points += 1;
    }
    if (match.homeTeamGoals > match.awayTeamGoals) {
      points += 3;
    }
    return points;
  });
  return totalPoints[totalPoints.length - 1];
};

const calcTotalVictoriesHome = (matches: Matches[]) => {
  let totalVictories = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    if (match.homeTeamGoals > match.awayTeamGoals) {
      totalVictories += 1;
    }
    return totalVictories;
  });
  return totalVictories;
};

const calcTotalDraws = (matches: Matches[]) => {
  let totalDraws = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    if (match.awayTeamGoals === match.homeTeamGoals) {
      totalDraws += 1;
    }
    return totalDraws;
  });
  return totalDraws;
};

const calcTotalLossesHome = (matches: Matches[]) => {
  let totalLosses = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    if (match.awayTeamGoals > match.homeTeamGoals) {
      totalLosses += 1;
    }
    return totalLosses;
  });
  return totalLosses;
};

const calcGoalsFavorHome = (matches: Matches[]) => {
  let goalsFavor = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsFavor += match.homeTeamGoals;
    return goalsFavor;
  });
  return goalsFavor;
};

const calcGoalsOwnHome = (matches: Matches[]) => {
  let goalsOwn = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsOwn += match.awayTeamGoals;
    return goalsOwn;
  });
  return goalsOwn;
};

const calcGoalsBalanceHome = (matches: Matches[]) => {
  let goalsBalance = 0;
  const goalsFavorHome = calcGoalsFavorHome(matches);
  const goalsOwnHome = calcGoalsOwnHome(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsBalance = goalsFavorHome - goalsOwnHome;
    return goalsBalance;
  });
  return goalsBalance;
};

const calcEfficiencyHome = (matches: Matches[]) => {
  let efficiency = 0;
  const totalPoints = calcTotalPointsHome(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    efficiency = Number(((totalPoints / (matches.length * 3)) * 100).toFixed(2));
    return efficiency;
  });
  return efficiency;
};

const newLeaderboardHome = (name: string, match: Matches[]) => {
  const data = {
    name,
    totalPoints: calcTotalPointsHome(match),
    totalGames: match.length,
    totalVictories: calcTotalVictoriesHome(match),
    totalDraws: calcTotalDraws(match),
    totalLosses: calcTotalLossesHome(match),
    goalsFavor: calcGoalsFavorHome(match),
    goalsOwn: calcGoalsOwnHome(match),
    goalsBalance: calcGoalsBalanceHome(match),
    efficiency: calcEfficiencyHome(match),
  };
  return data;
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

const calcHomeTeam = (matches: Team[]) => {
  const leaderboard = matches.map((team) => {
    if (team.teamHome) {
      return newLeaderboardHome(team.teamName, team.teamHome);
    }
    return {};
  });
  orderedLeaderboard(leaderboard as Ileaderboard[]);
  return leaderboard;
};

export default calcHomeTeam;
