/* eslint-disable no-unused-vars */
import React from "react";
import { success, failed } from "../assets/utils/Toasts";
import { getAuthHeaders } from "../assets/utils/Common";
import { getApiError } from "../assets/utils/Common";
const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    cancelld: "Cancelled",
  };
  return labels[status] || status;
};

const useTasksActions = ({
  setIsLoading,
  setError,
  limit,
  setTasks,
  setTotalTasks,
  setTotalPages,
  setCurrentPage,
  setUpdatingTaskId,
  setLimit,
  tasks,
  setDeletingTaskId,
  currentPage,
  statusFilter,
  sortBy,
  searchQuery,
}) => {
  const loadTasks = async (
    page = 1,
    status = "all",
    sort = "newest",
    search = "",
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (status !== "all") {
        params.append("status", status);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (sort === "newest") {
        params.append("sort", "-createdAt");
      } else if (sort === "oldest") {
        params.append("sort", "createdAt");
      } else if (sort === "deadline") {
        params.append("sort", "deadline");
      } else if (sort === "title") {
        params.append("sort", "title");
      }

      const response = await fetch(
        `http://localhost:5000/api/v1/tasks?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      const tasksData = Array.isArray(payload.data) ? payload.data : [];

      setTasks(tasksData);
      setTotalTasks(payload["total documents"] || tasksData.length);

      if (payload.paginationResult) {
        setCurrentPage(payload.paginationResult.currentPage || 1);
        setTotalPages(payload.paginationResult.pageCount || 1);
        setLimit(payload.paginationResult.limit || 5);
      } else {
        setTotalPages(Math.ceil(tasksData.length / limit));
      }
    } catch (error) {
      setError(error.message || "Unable to load tasks.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tasks/${taskId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId || task.id === taskId
            ? { ...task, status: newStatus }
            : task,
        ),
      );

      success(`Task status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      failed(error.message || "Failed to update task status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId || t.id === taskId);

    if (
      !window.confirm(
        `Are you sure you want to delete "${task?.title || "this task"}"?`,
      )
    ) {
      return;
    }

    setDeletingTaskId(taskId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(getApiError(payload));
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId && task.id !== taskId),
      );

      success("Task deleted successfully");
      loadTasks(currentPage, statusFilter, sortBy, searchQuery);
    } catch (error) {
      console.error("Error deleting task:", error);
      failed(error.message || "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  return {
    loadTasks,
    updateTaskStatus,
    deleteTask,
  };
};

export default useTasksActions;
