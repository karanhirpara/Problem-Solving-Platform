import mongoose, { Document, Schema } from 'mongoose';
import { Pool } from "pg";
 
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${'mongodb+srv://karankhirapara:karan12500@cluster0.usdq7.mongodb.net'}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}
export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
});
const main = async ()=> {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Time:", result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await pool.end();
  }
 
}
   const createTables = async () => {
  try {
    // Submissions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
          submission_id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          problem_id VARCHAR(20) NOT NULL,
          contest_id VARCHAR(24)  NOT NULL,
          verdict VARCHAR(20) NOT NULL,
          time_submitted TIME NOT NULL
      );
    `);

    // Contest Standings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contest_standings (
          contest_id INT NOT NULL,
          user_id INT NOT NULL,
          problem_id VARCHAR(20) NOT NULL,
          points INT DEFAULT 0,
          wrong_attempts INT DEFAULT 0,
          last_ac_time TIME,
          PRIMARY KEY (contest_id, user_id, problem_id)
      );
    `);

    // Leaderboard Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
          contest_id INT NOT NULL,
          user_id INT NOT NULL,
          total_points INT DEFAULT 0,
          PRIMARY KEY (contest_id, user_id)
      );
    `);

    console.log("✅ Tables created successfully in mydb");
  } catch (err) {
    console.error("❌ Error creating tables", err);
  }
};

createTables();

   
export default main
