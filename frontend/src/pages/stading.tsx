import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

import { useEffect, useState } from "react";
import {useLocation} from 'react-router-dom';
// Sample data for demonstration
const standingsData = [
  { rank: 1, username: "alice_coder", points: 2450, solved: 95 },
  { rank: 2, username: "bob_algorithm", points: 2380, solved: 89 },
  { rank: 3, username: "charlie_dev", points: 2200, solved: 82 },
  { rank: 4, username: "diana_prog", points: 2100, solved: 78 },
  { rank: 5, username: "eve_hacker", points: 1950, solved: 71 },
  { rank: 6, username: "frank_code", points: 1850, solved: 68 },
  { rank: 7, username: "grace_tech", points: 1750, solved: 64 },
  { rank: 8, username: "henry_solve", points: 1650, solved: 59 },
  { rank: 9, username: "ivy_logic", points: 1550, solved: 55 },
  { rank: 10, username: "jack_binary", points: 1450, solved: 51 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="text-muted-foreground">#{rank}</span>;
  }
};

const getRankBadgeVariant = (rank: number) => {
  if (rank <= 3) return "default";
  if (rank <= 10) return "secondary";
  return "outline";
};

interface LeaderboardEntry {
  member: string; // username
  score: number;
}

const Standings = () => {
  const location = useLocation();
let contestId = (location.state ?? undefined);
console.log(contestId)
contestId = contestId.toString();
const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

useEffect(() => {
  console.log("=== WEBSOCKET USEEFFECT STARTING ===");
  console.log("Contest ID:", contestId);
  
  const ws = new WebSocket("ws://localhost:4000");

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket server");
  };

  ws.onerror = (error) => {
    console.error("❌ WebSocket error:", error);
  };

  ws.onmessage = (event) => {
    console.log("=== WEBSOCKET MESSAGE RECEIVED ===");
    console.log("Raw event data:", event.data);
    console.log("Event data type:", typeof event.data);
    
    try {
      const message = event.data as string;
      console.log("Message as string:", message);
      
      const data = JSON.parse(message);
      console.log("Parsed data:", data);
      console.log("Data contestId:", data.contestId);
      console.log("Current contestId:", contestId);
      console.log("Contest IDs match:", data.contestId === contestId);
      
      if (data.contestId === contestId) {
        console.log("✅ Contest IDs match, updating leaderboard");
        console.log("Top users:", data.topUsers);
        setLeaderboard(data.topUsers);
      } else {
        console.log("❌ Contest IDs don't match, ignoring message");
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onclose = (event) => {
    console.log("❌ WebSocket disconnected");
    console.log("Close code:", event.code);
    console.log("Close reason:", event.reason);
  };

  return () => {
    console.log("Cleaning up WebSocket connection");
    ws.close();
  };
}, [contestId]);

      
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Standings</h1>
          <p className="text-muted-foreground text-lg">
            Global leaderboard showing top performers by points and problems solved
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Global Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-muted-foreground font-semibold w-20">#</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Username</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">Points</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-center">Rank Badge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow 
                    key={1} 
                    className="border-border hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getRankIcon(1)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-foreground font-medium">
                      {user.member}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {user.score}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Badge variant={getRankBadgeVariant(1)} className="font-semibold">
                        Rank {1}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Rankings are updated in real-time based on contest performance and problem solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Standings;