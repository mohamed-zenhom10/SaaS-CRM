// eslint-disable-next-line no-unused-vars
import React from "react";

const DashboardTasks = ({ dashboardData }) => {
  return (
    <div className="tasks-graph">
      <h4>Task Distribution</h4>
      <div className="circle">
        {dashboardData?.totalTasks}
        <span>Total Tasks</span>
      </div>
      <div className="tasks-distribution">
        <div className="task-data">
          <p>Completed</p>
          <span>{dashboardData?.completedTasks}</span>
        </div>
        <div className="task-data">
          <p>In progress</p>
          <span>{dashboardData?.overdueTasks}</span>
        </div>
        <div className="task-data">
          <p>Pending Review</p>
          <span>{dashboardData?.pendingTasks}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTasks;
