import { Contest } from "../model/contest.js";
// Demo usage
import { Problem  } from "../model/problem.js";

const getCurrentStatus = async (contest: Contest) => {
    
  const now = new Date();
  const contestStart = new Date(contest .startDate);
  contestStart.setHours(contest .startTime.getHours(), contest.startTime.getMinutes());
  
  const contestEnd = new Date(contest.endDate);
  contestEnd.setHours(contest.endTime.getHours(), contest.endTime.getMinutes());

  if (now < contestStart) {
    return 'UPCOMING';
  } else if (now >= contestStart && now <= contestEnd) {
    return 'LIVE';
  } else {
    return 'FINISHED';
  }
   
};

export const updateStatus = async()=> {
  const contests = await Contest.find();
  for (const contest of contests) {
    const newStatus = await getCurrentStatus(contest);
    if (newStatus !== contest.status) {
      contest.status = newStatus;
      await contest.save();
      if(contest.status === 'FINISHED'){
        const problems = await Problem.find({contest:contest._id});
        for (const problem of problems) {
          problem.visible = true;
          await problem.save();
        }
      }
    }
  }
};