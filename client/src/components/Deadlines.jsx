/* eslint-disable no-unused-vars */
import React from "react";
import { FaCalendar } from "react-icons/fa";


const Deadlines = ({ data }) => {
  const formattedDate = data?.deadline.split("T")[0];

  return (
    <div className="deadline-item">
      <div className="data">
        <h1>{data?.title}</h1>
        <p>Description: {data?.description}</p>
        <p>Project: {data?.project?.title}</p>
      </div>
      <div className="deadline">{formattedDate} <FaCalendar /></div>
    </div>
  );
};

export default Deadlines;
