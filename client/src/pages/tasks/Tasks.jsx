/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiPlus,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronDown,
} from "react-icons/fi";
import "./Tasks.css";
import useTasksActions from "../../hooks/useTasksActions";
import TasksTable from "../../components/TasksTable";

const STATUS_OPTIONS = ["pending", "completed", "overdue", "cancelld"];

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const { loadTasks, updateTaskStatus, deleteTask } = useTasksActions({
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
  });

  useEffect(() => {
    loadTasks(1, statusFilter, sortBy, searchQuery);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadTasks(currentPage, statusFilter, sortBy, searchQuery);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadTasks(1, statusFilter, sortBy, searchQuery);
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadTasks(1, statusFilter, sortBy, searchQuery);
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadTasks(newPage, statusFilter, sortBy, searchQuery);
    }
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateTaskStatus(taskId, newStatus);
  };

  const pageTasks = tasks;
  const pageStart = (currentPage - 1) * limit;

  const pageTaskIds = pageTasks.map((task) => task._id || task.id);

  const areAllPageTasksSelected =
    pageTaskIds.length > 0 &&
    pageTaskIds.every((taskId) => selectedTaskIds.includes(taskId));

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId],
    );
  };

  const togglePageSelection = () => {
    setSelectedTaskIds((currentIds) => {
      if (areAllPageTasksSelected) {
        return currentIds.filter((id) => !pageTaskIds.includes(id));
      }

      return [...new Set([...currentIds, ...pageTaskIds])];
    });
  };

  const statistics = {
    total: totalTasks,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    cancelled: tasks.filter((t) => t.status === "cancelld").length,
  };

  return (
    <section className="tasks-page">
      <div className="container">
        <div className="tasks-page__header">
          <div>
            <p className="tasks-page__eyebrow">Workspace</p>
            <h1>Tasks</h1>
            <p>Manage your project tasks and track progress.</p>
          </div>

          <button
            type="button"
            className="task-button task-button--primary"
            onClick={() => navigate("/layout/tasks/add-new-task")}
          >
            <FiPlus />
            New Task
          </button>
        </div>

        <div className="tasks-summary-grid">
          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--primary">
              <FiBriefcase />
            </div>
            <div>
              <p>Total Tasks</p>
              <strong>{statistics.total}</strong>
              <span>All tasks</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--success">
              <FiCheckCircle />
            </div>
            <div>
              <p>Completed</p>
              <strong>{statistics.completed}</strong>
              <span>Done</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--warning">
              <FiClock />
            </div>
            <div>
              <p>Pending</p>
              <strong>{statistics.pending}</strong>
              <span>In progress</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--danger">
              <FiAlertCircle />
            </div>
            <div>
              <p>Overdue</p>
              <strong>{statistics.overdue}</strong>
              <span>Need attention</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--secondary">
              <FiCheckCircle />
            </div>
            <div>
              <p>Cancelled</p>
              <strong>{statistics.cancelled}</strong>
              <span>Cancelled tasks</span>
            </div>
          </article>
        </div>

        <div className="tasks-toolbar">
          <div className="tasks-toolbar__filters">
            <div className="tasks-search">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tasks-search__input"
              />
            </div>

            <label className="task-select">
              <span className="status-filter-span">Filter by status: </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-select"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="cancelld">Cancelled</option>
              </select>
              <FiChevronDown />
            </label>

            <label className="task-sort">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="deadline">Deadline</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="tasks-message tasks-message--error">{error}</div>
        )}

        <TasksTable
          isLoading={isLoading}
          tasks={tasks}
          areAllPageTasksSelected={areAllPageTasksSelected}
          togglePageSelection={togglePageSelection}
          pageTasks={pageTasks}
          selectedTaskIds={selectedTaskIds}
          toggleTaskSelection={toggleTaskSelection}
          handleStatusChange={handleStatusChange}
          updatingTaskId={updatingTaskId}
          deleteTask={deleteTask}
          deletingTaskId={deletingTaskId}
          totalTasks={totalTasks}
          pageStart={pageStart}
          limit={limit}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
};

export default Tasks;
