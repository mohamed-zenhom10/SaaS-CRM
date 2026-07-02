import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../services/NotificationsServices.js";

import protectedRoute from "../middlewares/protected.js";

const NotificationRouter = express.Router();

NotificationRouter.get("/", protectedRoute, getNotifications);
NotificationRouter.put("/read", protectedRoute, markAsRead);
NotificationRouter.delete("/:id", protectedRoute, deleteNotification);

export default NotificationRouter;