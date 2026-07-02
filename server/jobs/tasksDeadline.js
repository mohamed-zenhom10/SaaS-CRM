import cron from "node-cron";
import checkTaskDeadlines from "../services/checkTaskDeadlines.js";

cron.schedule("0 9 * * *", async () => {
  console.log("Checking task deadlines...");
  await checkTaskDeadlines();
});
