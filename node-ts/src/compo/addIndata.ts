import { Problem } from "../model/problem.js";
import { Contest } from "../model/contest.js";
import  User  from "../model/user.js";
// & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h localhost -p 5432 -U postgres -d mydb
import { Pool } from "pg";
import { get } from "axios";
 const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT) || 5432,
  });

export const addIndatabase = async(userid: string,problemid: string, result: string) =>{
  
    const problem = await Problem.findById(problemid);
  if (!problem) {
    throw new Error("Problem not found");
  }

  // 2. Use problem.contest (ObjectId) to fetch contest
  const contest = await Contest.findById(problem.contest);
  if (!contest) {
    throw new Error("Contest not found");
  }

  const startTime = contest.startTime;

  const now = new Date();

// Convert startTime string to Date object today
const [startHour, startMinute] = startTime.split(":").map(Number);
const contestStart = new Date();
contestStart.setHours(startHour, startMinute, 0, 0);

// Difference in milliseconds
const diffMs = now.getTime() - contestStart.getTime();

// Convert difference to total minutes
const diffMinutesTotal = Math.floor(diffMs / (1000 * 60));

// Convert to hours and minutes
const diffHours = Math.floor(Math.abs(diffMinutesTotal) / 60);
const diffMinutes = Math.abs(diffMinutesTotal) % 60;



const dif=`${diffHours}:${diffMinutes}`;

 
 const userIdNum = parseInt(userid); 
 
  const query = `
    INSERT INTO submissions (user_id, problem_id, contest_id, verdict, time_submitted)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING submission_id;
  `;

  const values = [
  userIdNum,
  problemid,
  problem.contest.toString(), // convert ObjectId to string
  result,
  dif
];
  
  const res = await pool.query(query, values);
  
 const wrongAttempts = await countWrongAttempts(userIdNum, problemid, problem.contest.toString());
 let point = problem.point;
 console.log(wrongAttempts);
 const time = await getFirstAcceptedSubmissionTime(
    userIdNum,
    problem.contest.toString(),
    problemid
  );
  if(result=="accepted"){
  if(time){
    const parts = time.split(":").map(Number); // now guaranteed string → number[]
  const [hours, minutes, seconds] = parts;
    const penalty = (60 * hours) + minutes + (20 * wrongAttempts);
    point = point - penalty;
     const  currentContest= parseInt(problem.contest.toString());
    const leaderboard=await insertContestPoints(problem.contest.toString(), userid.toString(), point);

  }
}
   return res.rows[0];
}


const countWrongAttempts = async (
  userId: number,
  problemId: string,
  contestId: string
) => {
  const query = `
    SELECT COUNT(*) AS wrong_attempts
    FROM submissions
    WHERE user_id = $1
      AND problem_id = $2
      AND contest_id = $3
      AND verdict = 'wrong answer';
  `;

  const values = [userId, problemId, contestId];
 
  const res = await pool.query(query, values);
  const wrongAttempts = parseInt(res.rows[0].wrong_attempts, 10);
 // return as number
  return wrongAttempts;
};


export async function getFirstAcceptedSubmissionTime(
  userId: number,
  contestId: string,
  problemId: string
): Promise<string | null> {
  const query = `
    SELECT time_submitted
    FROM submissions
    WHERE user_id = $1
      AND contest_id = $2
      AND problem_id = $3
      AND verdict = 'accepted'
    ORDER BY time_submitted ASC
    LIMIT 1;
  `;

  const values = [userId, contestId, problemId];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0].time_submitted;
    } else {
      return null; // No accepted submission found
    }
  } catch (err) {
    console.error("Error fetching submission:", err);
    throw err;
  }
}


const insertContestPoints = async (contestId: string, userId: string, totalPoints = 0) => {
  try {
    
    const query = `
      INSERT INTO leaderboard (contest_id, user_id, total_points)
      VALUES ($1, $2, $3)
      ON CONFLICT (contest_id, user_id) 
      DO UPDATE SET total_points = EXCLUDED.total_points
      RETURNING *;
    `;

    const values = [contestId, userId, totalPoints];

    const result = await pool.query(query, values);
    console.log('Inserted/Updated row:', result.rows[0]);
  } catch (error) {
    console.error('Error inserting contest points:', error);
  }
};

export const fetchLeaderboard = async (contestId: string) => {
  // 1. Get leaderboard rows from Postgres
  const res = await pool.query(
    "SELECT user_id, total_points FROM leaderboard WHERE contest_id = $1",
    [contestId]
  );

  const rows = res.rows; // [{ user_id: 'u1', total_points: 50 }, ...]

   interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
    refreshToken?: string;
  
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
  }
  // 2. Fetch user details from MongoDB in one go
  const userIds = rows.map(r => r.user_id);
 
  
  
  const getusername =async(user_id: string) =>{
    const users = await User.findById(user_id);
  }

  return rows.map((r) => ({
    username: r.user_id, 
    total_points: r.total_points,
  }));
};