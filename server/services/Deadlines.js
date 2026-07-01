import ProjectModel from "../models/ProjectModel.js";
import sendEmail from "../util/transporter.js";

const checkDeadlines = async () => {
  try {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + 2);

    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const projects = await ProjectModel.find({
      deadline: {
        $gte: start,
        $lte: end,
      },
      status: {
        $ne: "completed",
      },
      reminderSent: false,
    }).populate("user");

    for (const project of projects) {
      await sendEmail(project.user.email, project.title, project.deadline);
      project.reminderSent = true;
      await project.save();
    }
  } catch (err) {
    console.log(err);
  }
};

export default checkDeadlines;
