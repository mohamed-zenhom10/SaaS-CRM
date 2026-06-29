/* eslint-disable no-unused-vars */
import React from "react";
import { FiChevronDown } from "react-icons/fi";

const ProjectToolbar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="projects-toolbar">
      <div className="projects-toolbar__filters">
        <div className="projects-search">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="projects-search__input"
          />
        </div>

        <label className="project-select">
          <span>Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="cancelld">Cancelled</option>
          </select>
          <FiChevronDown />
        </label>

        <label className="project-sort">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Project Title</option>
            <option value="client">Client Name</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default ProjectToolbar;
