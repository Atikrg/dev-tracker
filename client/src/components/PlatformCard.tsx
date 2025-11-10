import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  platform: "leetcode" | "codeforces" | "codechef";
  title: string;
  stats: Array<{ label: string; value: string | number }>;
}

const platformStyles = {
  leetcode: "border-l-4 border-l-leetcode hover:shadow-leetcode/10",
  codeforces: "border-l-4 border-l-codeforces hover:shadow-codeforces/10",
  codechef: "border-l-4 border-l-codechef hover:shadow-codechef/10",
};

const platformTitleStyles = {
  leetcode: "text-leetcode-foreground",
  codeforces: "text-codeforces-foreground",
  codechef: "text-codechef-foreground",
};

export function PlatformCard({ platform, title, stats }: PlatformCardProps) {
  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        platformStyles[platform]
      )}
    >
      <h3 className={cn("text-xl font-semibold mb-4", platformTitleStyles[platform])}>
        {title}
      </h3>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">{stat.label}</span>
            <span className="font-medium text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
