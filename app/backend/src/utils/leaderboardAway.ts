import Team, { Matches } from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';

const calcTotalPointsAway = (matches: Matches[]) => {
  let points = 0;
  const totalPoints = matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return 0;
    }
    if (match.awayTeamGoals === match.homeTeamGoals) {
      points += 1;
    }
    if (match.homeTeamGoals < match.awayTeamGoals) {
      points += 3;
    }
    return points;
  });
  return totalPoints[totalPoints.length - 1];
};

const calcTotalVictoriesAway = (matches: Matches[]) => {
  let totalVictories = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    if (match.homeTeamGoals < match.awayTeamGoals) {
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

const calcTotalLossesAway = (matches: Matches[]) => {
  let totalLosses = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    if (match.awayTeamGoals < match.homeTeamGoals) {
      totalLosses += 1;
    }
    return totalLosses;
  });
  return totalLosses;
};

const calcGoalsFavorAway = (matches: Matches[]) => {
  let goalsFavor = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsFavor += match.awayTeamGoals;
    return goalsFavor;
  });
  return goalsFavor;
};

const calcGoalsOwnAway = (matches: Matches[]) => {
  let goalsOwn = 0;
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsOwn += match.homeTeamGoals;
    return goalsOwn;
  });
  return goalsOwn;
};

const calcGoalsBalanceAway = (matches: Matches[]) => {
  let goalsBalance = 0;
  const goalsFavorAway = calcGoalsFavorAway(matches);
  const goalsOwnAway = calcGoalsOwnAway(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsBalance = goalsFavorAway - goalsOwnAway;
    return goalsBalance;
  });
  return goalsBalance;
};

const calcEfficiencyAway = (matches: Matches[]) => {
  let efficiency = 0;
  const totalPoints = calcTotalPointsAway(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    efficiency = Number(((totalPoints / (matches.length * 3)) * 100).toFixed(2));
    return efficiency;
  });
  return efficiency;
};

const newLeaderboardAway = (name: string, match: Matches[]) => {
  const data = {
    name,
    totalPoints: calcTotalPointsAway(match),
    totalGames: match.length,
    totalVictories: calcTotalVictoriesAway(match),
    totalDraws: calcTotalDraws(match),
    totalLosses: calcTotalLossesAway(match),
    goalsFavor: calcGoalsFavorAway(match),
    goalsOwn: calcGoalsOwnAway(match),
    goalsBalance: calcGoalsBalanceAway(match),
    efficiency: calcEfficiencyAway(match),
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

const calcAwayTeam = (matches: Team[]) => {
  const leaderboard = matches.map((team) => {
    if (team.teamAway) {
      return newLeaderboardAway(team.teamName, team.teamAway);
    }
    return {};
  });
  orderedLeaderboard(leaderboard as Ileaderboard[]);
  return leaderboard;
};

export default calcAwayTeam;
