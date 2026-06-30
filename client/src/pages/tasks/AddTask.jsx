import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FiChevronRight } from "react-icons/fi";
import "./Tasks.css";
import { success, failed } from "../../assets/utils/Toasts";
import { getAuthHeaders } from "../../assets/utils/Common";
import { getApiError } from "../../assets/utils/Common";
import { taskValidationSchema } from "../../assets/utils/Validations";
import TasksFrom from "../../components/TasksFrom";
import { API_RUL } from "../../api/api";

const getToday = () => new Date().toISOString().split("T")[0];

const AddTask = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      project: "",
      deadline: "",
    },

    validationSchema: taskValidationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id || userData.id;

        if (!userId) {
          failed("User ID not found. Please login again.");
          setSubmitting(false);
          return;
        }

        const taskData = {
          title: values.title.trim(),
          description: values.description.trim(),
          project: values.project,
          deadline: values.deadline,
          status: "pending",
          user: userId,
        };

        const response = await fetch(`${API_RUL}/api/v1/tasks`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        });

        const payload = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (payload.message?.includes("title")) {
              setFieldError("title", payload.message);
            } else if (payload.message?.includes("description")) {
              setFieldError("description", payload.message);
            } else if (payload.message?.includes("project")) {
              setFieldError("project", "Invalid project selected.");
            } else if (payload.message?.includes("deadline")) {
              setFieldError("deadline", payload.message);
            } else {
              failed(payload.message || "Failed to create task.");
            }
          } else {
            failed(
              payload.message || "Failed to create task. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Task created successfully!");
        setSubmitting(false);

        navigate("/layout/tasks", {
          state: { refresh: true },
          replace: true,
        });
      } catch (error) {
        console.error("Error creating task:", error);
        failed("Failed to create task. Please try again.");
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(
          `${API_RUL}/api/v1/projects?limit=1000`,
          {
            headers: getAuthHeaders(),
          },
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        const projectsData = Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjectsError(error.message || "Unable to load projects.");
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-task-page">
      <div className="container">
        <div className="task-breadcrumb">
          <button type="button" onClick={() => navigate("/layout/tasks")}>
            Tasks
          </button>

          <FiChevronRight />
          <span>New Task</span>
        </div>

        <div className="add-task-page__heading">
          <div>
            <h1>Create New Task</h1>
            <p>
              Define your next milestone and assign it to a project workflow.
            </p>
          </div>
        </div>

        <TasksFrom
          formik={formik}
          getFieldError={getFieldError}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
          projectsError={projectsError}
          getToday={getToday}
        />
      </div>
    </section>
  );
};

export default AddTask;
