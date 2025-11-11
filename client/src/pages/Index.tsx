import { useState } from "react";
import axios from "axios";
import { SearchBar } from "@/components/SearchBar";
import { PlatformCard } from "@/components/PlatformCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RatingsData {
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

const Index = () => {
  const [ratings, setRatings] = useState<RatingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRatings = async (username: string) => {
    if (!username.trim()) {
      setError("Please enter your username");
      return;
    }

    setLoading(true);
    setError("");
    setRatings(null);

    try {
      const res = await axios.get(`/api/fetch-all-ratings/${username}`);

      setRatings(res.data.data);
    } catch (err: any) {
      if (err.response && err.response.status === 429) {
        setError("⚠️ Too many requests! Try again after 1 minute.");
      } else {
        setError("User not found or server error");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log("ratings are", ratings);

  return (
    <div className="min-h-screen bg-white bg-grid">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Competitive Programming Platforms Ratings
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your performance across multiple platforms
          </p>
          <div className="mt-4 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-lg border border-border">
              <strong className="text-foreground">Note:</strong> This website
              displays profiles from LeetCode, CodeChef, and Codeforces. Your
              username must be the same across all three platforms.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <SearchBar onSearch={fetchRatings} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 border border-border shadow-sm"
              >
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ratings Cards */}
        {ratings && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ratings?.leetcode &&
              Object.keys(ratings.leetcode?.data?.userContestRanking).length >
                0 && (
                <PlatformCard
                  platform="leetcode"
                  title="LeetCode"
                  stats={[
                    {
                      label: "Rating",
                      value:
                        ratings.leetcode?.data?.userContestRanking?.rating ??
                        "N/A",
                    },
                    {
                      label: "Global Rank",
                      value:
                        ratings.leetcode?.data?.userContestRanking
                          ?.globalRanking ?? "N/A",
                    },
                    {
                      label: "Top %",
                      value:
                        ratings.leetcode?.data?.userContestRanking
                          ?.topPercentage ?? "N/A",
                    },
                  ]}
                />
              )}

            {ratings?.codeforces?.currentRating > 0 &&
              Object.keys(ratings?.codeforces).length > 0 && (
                <PlatformCard
                  platform="codeforces"
                  title="Codeforces"
                  stats={[
                    {
                      label: "Rating",
                      value: ratings.codeforces?.currentRating,
                    },
                    {
                      label: "Rank",
                      value: ratings.codeforces?.rank,
                    },
                    {
                      label: "Contribution",
                      value: ratings.codeforces?.contribution,
                    },
                  ]}
                />
              )}

            {ratings?.codechef && Object.keys(ratings.codechef).length > 0 && (
              <PlatformCard
                platform="codechef"
                title="CodeChef"
                stats={[
                  {
                    label: "Rating",
                    value: ratings.codechef?.currentRating,
                  },
                  {
                    label: "Highest",
                    value: ratings.codechef?.highestRating,
                  },
                  {
                    label: "Division",
                    value: ratings.codechef?.division,
                  },
                  {
                    label: "Global Rank",
                    value: ratings.codechef?.globalRank,
                  },
                ]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
