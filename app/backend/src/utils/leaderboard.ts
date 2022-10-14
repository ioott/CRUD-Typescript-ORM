import TeamDto from '../interfaces/teamDTO';
import MatchDto from '../interfaces/matchDTO';
import Team, { Matches } from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';

// const calcTotalPointsAwayTeam = (
//   awayTeamGoals: number,
//   homeTeamGoals: number,
// ) => {
//   if (!awayTeamGoals || !homeTeamGoals) {
//     return undefined;
//   }
//   if (awayTeamGoals === homeTeamGoals) {
//     let totalPoints = 0;
//     totalPoints += 1;
//     return totalPoints;
//   }
//   if (awayTeamGoals > homeTeamGoals) {
//     let totalPoints = 0;
//     totalPoints += 3;
//     return totalPoints;
//   }
// };

const calcTotalPoints = (matches: Matches[]) => {
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

const calcTotalVictories = (matches: Matches[]) => {
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

const calcTotalLosses = (matches: Matches[]) => {
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

const calcGoalsFavor = (matches: Matches[]) => {
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

const calcGoalsOwn = (matches: Matches[]) => {
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

const calcGoalsBalance = (matches: Matches[]) => {
  let goalsBalance = 0;
  const goalsFavor = calcGoalsFavor(matches);
  const goalsOwn = calcGoalsOwn(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    goalsBalance = goalsFavor - goalsOwn;
    return goalsBalance;
  });
  return goalsBalance;
};

const calcEfficiency = (matches: Matches[]) => {
  let efficiency = 0;
  const totalPoints = calcTotalPoints(matches);
  matches.map((match) => {
    if (match.awayTeamGoals === undefined || match.homeTeamGoals === undefined) {
      return undefined;
    }
    efficiency = Number(((totalPoints / (matches.length * 3)) * 100).toFixed(2));
    return efficiency;
  });
  return efficiency;
};

const newLeaderboard = (name: string, match: Matches[]) => {
  const data = {
    name,
    totalPoints: calcTotalPoints(match),
    totalGames: match.length,
    totalVictories: calcTotalVictories(match),
    totalDraws: calcTotalDraws(match),
    totalLosses: calcTotalLosses(match),
    goalsFavor: calcGoalsFavor(match),
    goalsOwn: calcGoalsOwn(match),
    goalsBalance: calcGoalsBalance(match),
    efficiency: calcEfficiency(match),
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
      return newLeaderboard(team.teamName, team.teamHome);
    }
    return {};
  });
  orderedLeaderboard(leaderboard as Ileaderboard[]);
  return leaderboard;
};

const calcAwayTeam = (
  match: MatchDto,
  team: TeamDto,
  totalGames: number,
) => {
  // const dataLeaderboard = {
  //   name: team.teamName,
  //   totalPoints: calcTotalPointsAwayTeam(match.awayTeamGoals, match.homeTeamGoals),
  //   totalGames,
  //   totalVictories: calcTotalVictoriesLossesDraws(match.awayTeamGoals, match.homeTeamGoals),
  //   totalDraws: calcTotalVictoriesLossesDraws(match.awayTeamGoals, match.homeTeamGoals),
  //   totalLosses: calcTotalVictoriesLossesDraws(match.awayTeamGoals, match.homeTeamGoals),
  //   goalsFavor: match.awayTeamGoals,
  //   goalsOwn: match.homeTeamGoals,
  //   goalsBalance: calcGoalsBalance(match.awayTeamGoals, match.homeTeamGoals),
  //   efficiency: calcEfficiency(match.awayTeamGoals, match.homeTeamGoals, totalGames),
  // };
  // return newLeaderboard(dataLeaderboard);
};

export { calcHomeTeam, calcAwayTeam };
