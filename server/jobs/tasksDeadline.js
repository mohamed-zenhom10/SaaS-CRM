import cron from "node-cron";
import checkTaskDeadlines from "../services/checkTaskDeadlines.js";

cron.schedule("* * * * *", async () => {
  console.log("Checking task deadlines...");
  await checkTaskDeadlines();
});
