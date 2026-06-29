import TaskModel from "../models/TaskModel.js";
import ProjectModel from "../models/ProjectModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import ClientModel from "../models/ClientModel.js";
import ApiError from "../errors/ApiError.js";

const DashboardData = async (req, res, next) => {
  try {
    const userFilter = { user: req.user._id };

    const [
      totalClients,
      totalProjects,
      totalTasks,
      totalInvoices,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completedProjects,
      pendingProjects,
      revenueResult,
      pendingPaymentResult,
      recentInvoices,
      upcomingDeadlines,
    ] = await Promise.all([
      ClientModel.countDocuments(userFilter),

      ProjectModel.countDocuments(userFilter),

      TaskModel.countDocuments(userFilter),

      InvoiceModel.countDocuments(userFilter),

      TaskModel.countDocuments({
        ...userFilter,
        status: "completed",
      }),

      TaskModel.countDocuments({
        ...userFilter,
        status: "pending",
      }),

      TaskModel.countDocuments({
        ...userFilter,
        status: "overdue",
      }),

      ProjectModel.countDocuments({
        ...userFilter,
        status: "completed",
      }),

      ProjectModel.countDocuments({
        ...userFilter,
        status: "pending",
      }),

      InvoiceModel.aggregate([
        {
          $match: {
            user: req.user._id,
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$amount",
            },
          },
        },
      ]),

      InvoiceModel.aggregate([
        {
          $match: {
            user: req.user._id,
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            pendingPayments: {
              $sum: "$amount",
            },
          },
        },
      ]),
      InvoiceModel.find(userFilter)
        .populate("client", "name")
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      TaskModel.find({ ...userFilter, status: { $ne: "completed" } })
        .populate("project", "title")
        .sort({ deadline: 1 })
        .limit(4)
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const pendingPayments = pendingPaymentResult[0]?.pendingPayments || 0;

    return res.status(200).json({
      message: "Dashboard data",
      data: {
        totalClients,
        totalProjects,
        totalTasks,
        totalInvoices,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completedProjects,
        pendingProjects,
        totalRevenue,
        pendingPayments,
        recentInvoices,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export default DashboardData;
