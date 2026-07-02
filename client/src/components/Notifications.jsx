// eslint-disable-next-line no-unused-vars
import React from "react";
import NotificationItem from "./NotificationItem";

const Notifications = ({ data }) => {
  return (
    <div className="notifications-popup">
      <h3>Notifications 🔔</h3>
      <section className="notifications-list">
        {data.map((item) => (
          <NotificationItem data={item} key={item?._id} />
        ))}
      </section>
    </div>
  );
};

export default Notifications;
