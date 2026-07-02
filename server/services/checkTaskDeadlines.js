import TaskModel from "../models/TaskModel.js";
import NotificationModel from "../models/NotificationModel.js";

const checkTaskDeadlines = async () => {
  try {
    const today = new Date();

    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 2);

    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const tasks = await TaskModel.find({
      deadline: {
        $gte: start,
        $lte: end,
      },
      status: {
        $ne: "completed",
      },
      reminderSent: false,
    }).populate("user");

    for (const task of tasks) {
      const notificationExists = await NotificationModel.findOne({
        task: task._id,
        user: task.user._id,
        type: "task",
      });

      if (!notificationExists) {
        await NotificationModel.create({
          user: task.user._id,
          task: task._id,
          title: "Task Deadline Reminder",
          message: `Task "${task.title}" is due on ${task.deadline.toDateString()}.`,
          type: "task",
          isRead: false,
        });

        task.reminderSent = true;
        await task.save();
      }
    }

    console.log(`${tasks.length} task notifications created.`);
  } catch (error) {
    console.error("Notification Cron Error:", error);
  }
};

export default checkTaskDeadlines;
