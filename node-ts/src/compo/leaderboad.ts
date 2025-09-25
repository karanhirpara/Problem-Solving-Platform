// src/compo/leaderboad.ts
import { Redis } from "ioredis";
import WebSocket, { WebSocketServer } from "ws";
import { fetchLeaderboard } from "./addIndata.js";
 


export function startLeaderboardWS() {
  console.log("leaderboad is running")
  const wss = new WebSocketServer({ port: 4000 });

  const redis = new Redis({ host: "localhost", port: 6379 });


  const storeLeaderboardInRedis = async (contestId: string) => {
    const leaderboard = await fetchLeaderboard(contestId);
    console.log(leaderboard)
    const key = `contest:${contestId}:leaderboard`;

    for (const row of leaderboard) {
      await redis.zadd(key, row.total_points, row.username);
    }
    console.log(`Leaderboard for contest ${contestId} loaded into Redis`);
  };

  const getTopUsers = async (contestId: string, topN: number) => {
    const key = `contest:${contestId}:leaderboard`;
    const raw = await redis.zrevrange(key, 0, topN - 1, "WITHSCORES");
    const result = [];
    for (let i = 0; i < raw.length; i += 2) {
      result.push({ member: raw[i], score: parseInt(raw[i + 1]) });
    }
    return result;
  };

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });

    ws.on("close", () => console.log("Client disconnected"));
  });

  const broadcastLeaderboard = (data: any) => {
    const message = JSON.stringify(data);
     console.log("Broadcasting to clients. Total clients:", wss.clients.size);
    wss.clients.forEach((client) => {
      console.log("Client readyState:", client.readyState);
      if (client.readyState === 1) {
        client.send(message);
         console.log("Sent message to client:", message);
      }
    });
  };

  const subscriber = new Redis({ host: "localhost", port: 6379 });
  subscriber.subscribe("leaderboard-updates");

  subscriber.on("message", async (channel, message) => {
    console.log("Received leaderboard update:", message);
    const { contestId, topN } = JSON.parse(message);
    const topUsers = await getTopUsers(contestId, topN);
    console.log(topUsers);
    broadcastLeaderboard({ contestId, topUsers });
  });

  const updateUserPoints = async (contestId: string) => {
    await storeLeaderboardInRedis(contestId);
    await redis.publish(
      "leaderboard-updates",
      JSON.stringify({ contestId, topN: 10 })
    );
  };
  
  
  console.log("🚀 Standalone Leaderboard WS running on ws://localhost:3000");

  return { updateUserPoints }; // export the updater if needed
}
