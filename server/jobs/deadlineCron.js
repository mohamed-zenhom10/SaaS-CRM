import cron from "node-cron";
import checkDeadlines from "../services/Deadlines.js";
// send it every minute: * * * * *
// send it 9 AM evert day 0 9 * * *
cron.schedule("* * * * *", async () => {
  console.log("Checking project deadlines...");
  await checkDeadlines();
});
