// utils/updateContestStatus.ts
import { Contest } from "../model/contest.js";

export const updateContestStatuses = async () => {
  const now = new Date();

  // Fetch all contests
  const contests = await Contest.find();

  for (const contest of contests) {
    const contestStart = new Date(contest.startDate);
    const contestEnd = new Date(contest.endDate);

    // Apply startTime and endTime on top of dates
    const [startHour, startMin] = contest.startTime.split(":").map(Number);
    contestStart.setHours(startHour, startMin, 0, 0);

    const [endHour, endMin] = contest.endTime.split(":").map(Number);
    contestEnd.setHours(endHour, endMin, 0, 0);

    let newStatus = contest.status;

    if (now < contestStart) {
      newStatus = "upcoming";
    } else if (now >= contestStart && now <= contestEnd) {
      newStatus = "live";
    } else if (now > contestEnd) {
      newStatus = "finished";
    }

    // Update only if status changed
    if (contest.status !== newStatus) {
      contest.status = newStatus;
      contest.updatedAt = now;
      await contest.save();
      console.log(`Contest "${contest.title}" updated to ${newStatus}`);
    }
  }
};
