/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import DashboardBox from "../../components/DashboardBox";
import { FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import DashboardGraph from "../../components/DashboardGraph";
import DashboardTasks from "../../components/DashboardTasks";
import { useNavigate } from "react-router-dom";
import RecentInvoices from "../../components/RecentInvoices";
import Deadlines from "../../components/Deadlines";
import { exportDashboardPDF } from "../../assets/utils/functions";

import { API_RUL } from "../../api/api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalInvoices: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completedProjects: 0,
    pendingProjects: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    recentInvoices: [],
    upcomingDeadlines: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_RUL}/api/v1/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result?.data) {
          setDashboardData(result?.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  console.log(dashboardData);

  return (
    <section className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="text">
            <h1>Analytics Overview</h1>
            <p>Your performance and operational health at a glance.</p>
          </div>
          <div className="dashboard-btns">
            <button>Last 30 days</button>
            <button onClick={() => exportDashboardPDF(dashboardData)}>
              Export PDF
            </button>
          </div>
        </div>

        <div className="dashbaord-numbers">
          <DashboardBox
            icon={<FaUsers />}
            title="TOTAL CLIENTS"
            number={dashboardData.totalClients}
            info="Total registered clients"
          />
          <DashboardBox
            icon={<FaClipboardList />}
            title="TOTAL PROJECTS"
            number={dashboardData.totalProjects}
            info={`${dashboardData.completedProjects} completed, ${dashboardData.pendingProjects} pending`}
          />
          <DashboardBox
            icon={<MdChecklist />}
            title="TOTAL TASKS"
            number={dashboardData.totalTasks}
            info={`${dashboardData.completedTasks} done, ${dashboardData.pendingTasks} pending`}
          />
          <DashboardBox
            icon={<FaMoneyBillAlt />}
            title="TOTAL REVENUE"
            number={formatCurrency(dashboardData.totalRevenue)}
            info={`${formatCurrency(dashboardData.pendingPayments)} pending`}
          />
        </div>

        <div className="dashboard-stats">
          <DashboardGraph data={dashboardData} />
          <DashboardTasks dashboardData={dashboardData} />
        </div>

        <div className="upcoming-deadlines">
          <div className="upcoming-head">
            <h3>Upcoming Deadlines</h3>
            <p>
              {dashboardData?.upcomingDeadlines?.length}{" "}
              <span>High Priority</span>
            </p>
          </div>
          <div className="deadlines">
            {isLoading ? (
              <>
                <p className="loading">Loading...</p>
              </>
            ) : dashboardData?.upcomingDeadlines?.length > 0 ? (
              dashboardData?.upcomingDeadlines?.map((item) => (
                <Deadlines key={item._id} data={item} />
              ))
            ) : (
              <p>No Upcoming Deadlines</p>
            )}
          </div>
        </div>

        <div className="recent-invoices">
          <div className="invoices-head">
            <h3>Recent Invoices</h3>
            <button onClick={() => navigate("/layout/invoices")}>
              All Invoices
            </button>
          </div>
          <div className="table">
            {isLoading ? (
              <p className="loading">Loading....</p>
            ) : dashboardData?.recentInvoices?.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Invoice Id</th>
                    <th>Client</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentInvoices?.map((item) => (
                    <RecentInvoices key={item._id} data={item} />
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No Invoices Yet</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
