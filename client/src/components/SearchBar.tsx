import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(username);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" disabled={loading} className="gap-2">
        <Search className="w-4 h-4" />
        {loading ? "Loading..." : "Search"}
      </Button>
    </form>
  );
}
