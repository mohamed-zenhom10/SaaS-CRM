/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

const TasksFrom = ({
  formik,
  getFieldError,
  projects,
  isLoadingProjects,
  projectsError,
  getToday,
}) => {
  const navigate = useNavigate();

  return (
    <form className="task-form-card" onSubmit={formik.handleSubmit} noValidate>
      <div className="task-form-group">
        <label htmlFor="title">Task Title</label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Prepare the website content"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={getFieldError("title") ? "has-error" : ""}
          aria-invalid={Boolean(getFieldError("title"))}
        />

        {getFieldError("title") && (
          <small className="task-form-error">{formik.errors.title}</small>
        )}
      </div>

      <div className="task-form-group">
        <div className="task-form-group__label-row">
          <label htmlFor="description">Description</label>
          <span>{formik.values.description.length}/50</span>
        </div>

        <textarea
          id="description"
          name="description"
          placeholder="Briefly describe what needs to be done..."
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={getFieldError("description") ? "has-error" : ""}
          aria-invalid={Boolean(getFieldError("description"))}
        />

        {getFieldError("description") && (
          <small className="task-form-error">{formik.errors.description}</small>
        )}
      </div>

      <div className="task-form-row">
        <div className="task-form-group">
          <label htmlFor="project">Related Project</label>

          <select
            id="project"
            name="project"
            value={formik.values.project}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoadingProjects}
            className={getFieldError("project") ? "has-error" : ""}
            aria-invalid={Boolean(getFieldError("project"))}
          >
            <option value="">
              {isLoadingProjects ? "Loading projects..." : "Select a project"}
            </option>

            {projects.map((project) => (
              <option
                key={project._id || project.id}
                value={project._id || project.id}
              >
                {project.title || project.name || "Untitled project"}
              </option>
            ))}
          </select>

          {getFieldError("project") && (
            <small className="task-form-error">{formik.errors.project}</small>
          )}

          {projectsError && (
            <small className="task-form-error">{projectsError}</small>
          )}
        </div>

        <div className="task-form-group">
          <label htmlFor="deadline">Deadline</label>

          <div className="task-date-input">
            <input
              id="deadline"
              name="deadline"
              type="date"
              min={getToday()}
              value={formik.values.deadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("deadline") ? "has-error" : ""}
              aria-invalid={Boolean(getFieldError("deadline"))}
            />
          </div>

          {getFieldError("deadline") && (
            <small className="task-form-error">{formik.errors.deadline}</small>
          )}
        </div>

      </div>

      <div className="task-form-card__actions">
        <button
          type="button"
          className="task-button task-button--secondary"
          onClick={() => navigate("/layout/tasks")}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="task-button task-button--primary"
          disabled={formik.isSubmitting || isLoadingProjects}
        >
          <FiPlus />
          {formik.isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TasksFrom;
