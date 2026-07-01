import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "mohamedzenhom7005@gmail.com",
    pass: "xwux clfs dnoy xhst",
  },
});

const sendEmail = async (userEmail, projectTitle, deadline) => {
  try {
    await transporter.sendMail({
      from: "mohamedzenhom7005@gmail.com",
      to: userEmail,
      subject: "Project Deadline Reminder",
      html: `
        <h2>Hello!</h2>

        <p>Your project <b>${projectTitle}</b> will reach its deadline on:</p>

        <h3>${deadline.toDateString()}</h3>

        <p>Please make sure to finish it before the deadline.</p>
      `,
    });

    console.log(`Email sent to ${userEmail}`);
  } catch (err) {
    console.log(err);
  }
};

export default sendEmail;
