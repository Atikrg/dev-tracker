import { useState } from "react";
import axios from "axios";
import { SearchBar } from "@/components/SearchBar";
import { PlatformCard } from "@/components/PlatformCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trophy } from "lucide-react";

interface RatingsData {
  leetcode: {
    data: {
      data: {
        userContestRanking?: {
          rating?: number;
          globalRanking?: number;
          topPercentage?: number;
        };
      };
    };
  };
  codeforces: {
    data: {
      currentRating: number;
      rank: string;
      contribution: number;
    };
  };
  codechef: {
    data: {
      currentRating: number;
      highestRating: number;
      division: string;
      globalRank: number;
    };
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

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Competitive Programming Ratings
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your performance across multiple platforms
          </p>
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

        {/* Ratings Cards */}
        {ratings && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <PlatformCard
              platform="leetcode"
              title="LeetCode"
              stats={[
                {
                  label: "Rating",
                  value: ratings.leetcode.data.data.userContestRanking?.rating ?? "N/A",
                },
                {
                  label: "Global Rank",
                  value: ratings.leetcode.data.data.userContestRanking?.globalRanking ?? "N/A",
                },
                {
                  label: "Top %",
                  value: ratings.leetcode.data.data.userContestRanking?.topPercentage ?? "N/A",
                },
              ]}
            />

            <PlatformCard
              platform="codeforces"
              title="Codeforces"
              stats={[
                {
                  label: "Rating",
                  value: ratings.codeforces.data.currentRating,
                },
                {
                  label: "Rank",
                  value: ratings.codeforces.data.rank,
                },
                {
                  label: "Contribution",
                  value: ratings.codeforces.data.contribution,
                },
              ]}
            />

            <PlatformCard
              platform="codechef"
              title="CodeChef"
              stats={[
                {
                  label: "Rating",
                  value: ratings.codechef.data.currentRating,
                },
                {
                  label: "Highest",
                  value: ratings.codechef.data.highestRating,
                },
                {
                  label: "Division",
                  value: ratings.codechef.data.division,
                },
                {
                  label: "Global Rank",
                  value: ratings.codechef.data.globalRank,
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
