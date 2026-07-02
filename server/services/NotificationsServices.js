import NotificationModel from "../models/NotificationModel.js";
import ApiError from "../errors/ApiError.js";

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({
      user: req.user._id,
    })
      .populate("task")
      .sort("-createdAt")
      .limit(10);

    const unReadNotes = await NotificationModel.countDocuments({
      user: req.user._id,
      isRead: false,
    })

    return res.status(200).json({
      message: "Notifications fetched successfully.",
      results: notifications.length,
      data: notifications,
      unReadNotes,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notifications = await NotificationModel.updateMany(
      {
        user: req.user._id,
        isRead: false
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );
    return res.status(200).json({
      message: "Notifications marked as read.",
      data: notifications,
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await NotificationModel.findByIdAndDelete(
      req.params.id,
    );

    if (!notification) {
      return next(new ApiError("Notification not found.", 404));
    }

    return res.status(200).json({
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

