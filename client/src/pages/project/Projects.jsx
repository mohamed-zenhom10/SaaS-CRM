/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import "./Projects.css";
import { success, failed } from "../../assets/utils/Toasts";
import ProjectGrid from "../../components/ProjectGrid";
import ProjectTable from "../../components/ProjectTable";
import {
  getAuthHeaders,
  getApiError,
  PAGE_SIZE,
  formatDate,
  getInitials,
  getClientName,
  getStatusLabel,
} from "../../assets/utils/Common";
import ProjectToolbar from "../../components/ProjectToolbar";
import { useProjectActions } from "../../hooks/useProjectActions";
import { useProjectData } from "../../hooks/useProjectData";

const STATUS_OPTIONS = ["pending", "completed", "overdue", "cancelld"];

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const { loadProjects, updateProjectStatus, deleteProject } =
    useProjectActions({
      projects,
      setProjects,
      setIsLoading,
      setLoadError,
      setUpdatingProjectId,
      setDeletingProjectId,
      statusFilter,
      sortBy,
      success,
      failed,
      getAuthHeaders,
      getApiError,
      getStatusLabel,
    });

  const { projectRows, filteredProjects, statistics } = useProjectData({
    projects,
    statusFilter,
    searchQuery,
    sortBy,
    getClientName,
  });

  useEffect(() => {
    loadProjects(1);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadProjects(currentPage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE),
  );

  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProjects = filteredProjects.slice(pageStart, pageStart + PAGE_SIZE);

  const pageProjectIds = pageProjects.map((project) => project.id);
  const areAllPageProjectsSelected =
    pageProjectIds.length > 0 &&
    pageProjectIds.every((projectId) => selectedProjectIds.includes(projectId));

  const toggleProjectSelection = (projectId) => {
    setSelectedProjectIds((currentIds) =>
      currentIds.includes(projectId)
        ? currentIds.filter((id) => id !== projectId)
        : [...currentIds, projectId],
    );
  };

  const togglePageSelection = () => {
    setSelectedProjectIds((currentIds) => {
      if (areAllPageProjectsSelected) {
        return currentIds.filter((id) => !pageProjectIds.includes(id));
      }
      return [...new Set([...currentIds, ...pageProjectIds])];
    });
  };

  const moveToPage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleStatusChange = (projectId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateProjectStatus(projectId, newStatus);
  };

  return (
    <section className="projects-page">
      <div className="container">
        <div className="projects-page__header">
          <div>
            <p className="projects-page__eyebrow">Workspace</p>
            <h1>Projects</h1>
            <p>Manage and track your ongoing projects.</p>
          </div>

          <button
            type="button"
            className="project-button project-button--primary"
            onClick={() => navigate("/layout/projects/add-new-project")}
          >
            <FiPlus />
            New Project
          </button>
        </div>

        <ProjectToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loadError && (
          <div className="projects-message projects-message--error">
            {loadError}
          </div>
        )}

        <ProjectGrid statistics={statistics} />
        <ProjectTable
          handleStatusChange={handleStatusChange}
          isLoading={isLoading}
          moveToPage={moveToPage}
          togglePageSelection={togglePageSelection}
          toggleProjectSelection={toggleProjectSelection}
          deleteProject={deleteProject}
          deletingProjectId={deletingProjectId}
          updatingProjectId={updatingProjectId}
          getInitials={getInitials}
          formatDate={formatDate}
          areAllPageProjectsSelected={areAllPageProjectsSelected}
          pageProjects={pageProjects}
          selectedProjectIds={selectedProjectIds}
          getStatusLabel={getStatusLabel}
          filteredProjects={filteredProjects}
          pageStart={pageStart}
          PAGE_SIZE={PAGE_SIZE}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
};

export default Projects;
