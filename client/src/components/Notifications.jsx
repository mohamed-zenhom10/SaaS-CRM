// eslint-disable-next-line no-unused-vars
import React from "react";
import NotificationItem from "./NotificationItem";

const Notifications = ({ data }) => {
  return (
    <div className="notifications-popup">
      <h3>Notifications 🔔</h3>
      <section className="notifications-list">
        {data.length > 0 ? (
          data.map((item) => <NotificationItem data={item} key={item?._id} />)
        ) : (
          <p style={{marginTop: "5px"}}>No Notifications Yet</p>
        )}
      </section>
    </div>
  );
};

export default Notifications;
