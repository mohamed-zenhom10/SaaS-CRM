/* eslint-disable no-unused-vars */
import React from "react";
import { formatDate } from "../assets/utils/Common";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    cancelld: "Cancelled",
  };
  return labels[status] || status;
};

const TasksTable = ({
  isLoading,
  tasks,
  areAllPageTasksSelected,
  togglePageSelection,
  pageTasks,
  selectedTaskIds,
  toggleTaskSelection,
  handleStatusChange,
  updatingTaskId,
  deleteTask,
  deletingTaskId,
  totalTasks,
  pageStart,
  limit,
  handlePageChange,
  currentPage,
  totalPages,
}) => {
  const navigate = useNavigate();

  return isLoading ? (
    <div className="tasks-loading">Loading tasks...</div>
  ) : tasks.length === 0 ? (
    <div className="tasks-empty">
      <p>No tasks found. Create your first task!</p>
    </div>
  ) : (
    <div className="tasks-table-card">
      <div className="tasks-table-scroll">
        <table>
          <thead>
            <tr>
              <th className="tasks-table__checkbox">
                <input
                  type="checkbox"
                  checked={areAllPageTasksSelected}
                  onChange={togglePageSelection}
                  aria-label="Select all visible tasks"
                />
              </th>
              <th>Task Title</th>
              <th>Project</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageTasks.map((task) => (
              <tr key={task._id || task.id}>
                <td className="tasks-table__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task._id || task.id)}
                    onChange={() => toggleTaskSelection(task._id || task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                </td>
                <td>
                  <div className="task-title-cell">
                    <span
                      className={`task-title-cell__marker task-title-cell__marker--${task.status}`}
                    />
                    <strong>{task.title}</strong>
                  </div>
                </td>
                <td>
                  <span className="task-project-name">
                    {typeof task?.project === "object"
                      ? task?.project?.title || "No project"
                      : task?.project || "No project"}
                  </span>
                </td>
                <td>
                  <span className="task-date">
                    <FiCalendar />
                    {formatDate(task.deadline)}
                  </span>
                </td>
                <td>
                  <span
                    className={`task-status task-status--${task.status}`}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleStatusChange(task._id || task.id, task.status)
                    }
                    title="Click to change status"
                  >
                    {updatingTaskId === (task._id || task.id)
                      ? "Updating..."
                      : getStatusLabel(task.status)}
                  </span>
                </td>
                <td>
                  <div className="task-actions">
                    {/* <button
                      type="button"
                      className="task-action-button task-action-button--edit"
                      onClick={() => {
                        navigate(`/layout/tasks/edit/${task._id || task.id}`);
                      }}
                      title="Edit task"
                    >
                      <FiEdit />
                    </button> */}
                    <button
                      type="button"
                      className="task-action-button task-action-button--delete"
                      onClick={() => deleteTask(task._id || task.id)}
                      disabled={deletingTaskId === (task._id || task.id)}
                      title="Delete task"
                    >
                      {deletingTaskId === (task._id || task.id) ? (
                        "..."
                      ) : (
                        <FiTrash2 />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && totalTasks > 0 && (
        <div className="tasks-pagination">
          <p>
            Showing {pageStart + 1}–{Math.min(pageStart + limit, totalTasks)} of{" "}
            {totalTasks} tasks
          </p>

          <div>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FiChevronLeft />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
