/* eslint-disable no-unused-vars */
import React from "react";

import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiEdit,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProjectTable = ({
  handleStatusChange,
  isLoading,
  moveToPage,
  togglePageSelection,
  toggleProjectSelection,
  deleteProject,
  deletingProjectId,
  updatingProjectId,
  getInitials,
  formatDate,
  areAllPageProjectsSelected,
  pageProjects,
  selectedProjectIds,
  getStatusLabel,
  filteredProjects,
  pageStart,
  PAGE_SIZE,
  currentPage,
  totalPages,
}) => {
  const navigate = useNavigate();

  return (
    <div className="projects-table-card">
      <div className="projects-table-scroll">
        <table>
          <thead>
            <tr>
              <th className="projects-table__checkbox">
                <input
                  type="checkbox"
                  checked={areAllPageProjectsSelected}
                  onChange={togglePageSelection}
                  aria-label="Select all visible projects"
                />
              </th>
              <th>Project Title</th>
              <th>Client</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="projects-table__state">
                  Loading your projects...
                </td>
              </tr>
            ) : pageProjects.length ? (
              pageProjects.map((project) => (
                <tr key={project.id}>
                  <td className="projects-table__checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProjectIds.includes(project.id)}
                      onChange={() => toggleProjectSelection(project.id)}
                      aria-label={`Select ${project.title}`}
                    />
                  </td>

                  <td>
                    <div className="project-title-cell">
                      <span
                        className={`project-title-cell__marker project-title-cell__marker--${project.status}`}
                      />
                      <strong>{project.title}</strong>
                    </div>
                  </td>

                  <td>
                    <div className="project-client">
                      <span>{getInitials(project.clientName)}</span>
                      <p>{project.clientName}</p>
                    </div>
                  </td>

                  <td>
                    <small className="project-description">
                      {project.description || "No description"}
                    </small>
                  </td>

                  <td>
                    <span className="project-date">
                      <FiCalendar />
                      {formatDate(project.deadline)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`project-status project-status--${project.status}`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleStatusChange(project.id, project.status)
                      }
                      title="Click to change status"
                    >
                      {updatingProjectId === project.id
                        ? "Updating..."
                        : getStatusLabel(project.status)}
                    </span>
                  </td>

                  <td>
                    <div className="project-actions">
                      <button
                        type="button"
                        className="project-action-button project-action-button--edit"
                        onClick={() => {
                          navigate(`/layout/projects/edit/${project.id}`);
                        }}
                        title="Edit project"
                      >
                        <FiEdit />
                      </button>
                      <button
                        type="button"
                        className="project-action-button project-action-button--delete"
                        onClick={() => deleteProject(project.id)}
                        disabled={deletingProjectId === project.id}
                        title="Delete project"
                      >
                        {deletingProjectId === project.id ? (
                          "..."
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="projects-table__state">
                  No projects match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredProjects.length > 0 && (
        <div className="projects-pagination">
          <p>
            Showing {pageStart + 1}–
            {Math.min(pageStart + PAGE_SIZE, filteredProjects.length)} of{" "}
            {filteredProjects.length} projects
          </p>

          <div>
            <button
              type="button"
              onClick={() => moveToPage(currentPage - 1)}
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
              onClick={() => moveToPage(currentPage + 1)}
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

export default ProjectTable;
