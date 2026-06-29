import { useMemo } from "react";

export const useProjectData = ({
  projects,
  statusFilter,
  searchQuery,
  sortBy,
  getClientName,
}) => {
  const projectRows = useMemo(() => {
    return projects.map((project) => {
      let projectStatus = project.status || "pending";

      if (projectStatus !== "completed" && projectStatus !== "cancelld") {
        const deadline = project.deadline ? new Date(project.deadline) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (deadline && !Number.isNaN(deadline.getTime()) && deadline < today) {
          projectStatus = "overdue";
        }
      }

      return {
        id: project._id || project.id,
        title: project.title || "Untitled project",
        description: project.description || "",
        deadline: project.deadline || "",
        status: projectStatus,
        clientName: getClientName(project.client),
        client: project.client,
        user: project.user,
        createdAt: project.createdAt,
        originalProject: project,
      };
    });
  }, [projects, getClientName]);

  const filteredProjects = useMemo(() => {
    let rows = projectRows.filter((project) => {
      return statusFilter === "all" || project.status === statusFilter;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      rows = rows.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.clientName.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query),
      );
    }

    return [...rows].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "client") {
        return a.clientName.localeCompare(b.clientName);
      }

      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      const firstDeadline = a.deadline
        ? new Date(a.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      const secondDeadline = b.deadline
        ? new Date(b.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      return firstDeadline - secondDeadline;
    });
  }, [projectRows, statusFilter, searchQuery, sortBy]);

  const statistics = useMemo(() => {
    const totalProjects = projectRows.length;

    const completedProjects = projectRows.filter(
      (project) => project.status === "completed",
    ).length;

    const overdueProjects = projectRows.filter(
      (project) => project.status === "overdue",
    ).length;

    const pendingProjects = projectRows.filter(
      (project) => project.status === "pending",
    ).length;

    const cancelledProjects = projectRows.filter(
      (project) => project.status === "cancelld",
    ).length;

    return {
      total: totalProjects,
      completed: completedProjects,
      overdue: overdueProjects,
      pending: pendingProjects,
      cancelled: cancelledProjects,
      completionRate: totalProjects
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0,
    };
  }, [projectRows]);

  return {
    projectRows,
    filteredProjects,
    statistics,
  };
};
