import { useCallback } from "react";
import { API_RUL } from "../api/api";
export const useProjectActions = ({
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
}) => {
  const loadProjects = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setLoadError("");

      try {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 100);

        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        if (sortBy === "newest") {
          params.append("sort", "-createdAt");
        } else if (sortBy === "oldest") {
          params.append("sort", "createdAt");
        } else if (sortBy === "title") {
          params.append("sort", "title");
        } else if (sortBy === "client") {
          params.append("sort", "client.name");
        }

        const response = await fetch(
          `${API_RUL}/api/v1/projects?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          },
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        setProjects(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        setLoadError(error.message || "Unable to load projects right now.");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      statusFilter,
      sortBy,
      getAuthHeaders,
      getApiError,
      setProjects,
      setIsLoading,
      setLoadError,
    ],
  );

  const updateProjectStatus = useCallback(
    async (id, status) => {
      setUpdatingProjectId(id);

      try {
        const response = await fetch(
          `${API_RUL}/api/v1/projects/${id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
          },
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === id || project.id === id
              ? { ...project, status }
              : project,
          ),
        );

        success(`Project status updated to ${getStatusLabel(status)}`);
      } catch (error) {
        console.error("Error updating project status:", error);
        failed(error.message || "Failed to update project status");
      } finally {
        setUpdatingProjectId(null);
      }
    },
    [
      getAuthHeaders,
      getApiError,
      getStatusLabel,
      success,
      failed,
      setProjects,
      setUpdatingProjectId,
    ],
  );

  const deleteProject = useCallback(
    async (id) => {
      const project = projects.find((p) => p._id === id || p.id === id);

      if (
        !window.confirm(
          `Are you sure you want to delete "${
            project?.title || "this project"
          }"?`,
        )
      ) {
        return;
      }

      setDeletingProjectId(id);

      try {
        const response = await fetch(
          `${API_RUL}/api/v1/projects/${id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          },
        );

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(getApiError(payload));
        }

        setProjects((prevProjects) =>
          prevProjects.filter(
            (project) => project._id !== id && project.id !== id,
          ),
        );

        success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        failed(error.message || "Failed to delete project");
      } finally {
        setDeletingProjectId(null);
      }
    },
    [
      projects,
      getAuthHeaders,
      getApiError,
      success,
      failed,
      setProjects,
      setDeletingProjectId,
    ],
  );

  return {
    loadProjects,
    updateProjectStatus,
    deleteProject,
  };
};
