export interface RatingsData {
  leetcode: {
    data: {
      userContestRanking?: {
        rating?: number;
        globalRanking?: number;
        topPercentage?: number;
      };
    };
  };
  codeforces: {
    currentRating: number;
    rank: string;
    contribution: number;
  };
  codechef: {
    currentRating: number;
    highestRating: number;
    division: string;
    globalRank: number;
  };
}