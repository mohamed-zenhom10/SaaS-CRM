import { FiCheckCircle, FiClock } from "react-icons/fi";
import { FiBriefcase } from "react-icons/fi";

const ProjectGrid = ({ statistics }) => {
  return (
    <div className="projects-summary-grid">
      <article className="project-summary-card">
        <div className="project-summary-card__icon project-summary-card__icon--primary">
          <FiBriefcase />
        </div>
        <div>
          <p>Total Projects</p>
          <strong>{statistics.total}</strong>
          <span>All projects</span>
        </div>
      </article>

      <article className="project-summary-card">
        <div className="project-summary-card__icon project-summary-card__icon--success">
          <FiCheckCircle />
        </div>
        <div>
          <p>Completed</p>
          <strong>{statistics.completed}</strong>
          <span>{statistics.completionRate}% completion rate</span>
        </div>
      </article>

      <article className="project-summary-card">
        <div className="project-summary-card__icon project-summary-card__icon--warning">
          <FiClock />
        </div>
        <div>
          <p>Pending</p>
          <strong>{statistics.pending}</strong>
          <span>Awaiting action</span>
        </div>
      </article>

      <article className="project-summary-card">
        <div className="project-summary-card__icon project-summary-card__icon--danger">
          <FiClock />
        </div>
        <div>
          <p>Overdue</p>
          <strong>{statistics.overdue}</strong>
          <span>Need immediate attention</span>
        </div>
      </article>

      <article className="project-summary-card">
        <div className="project-summary-card__icon project-summary-card__icon--secondary">
          <FiCheckCircle />
        </div>
        <div>
          <p>Cancelled</p>
          <strong>{statistics.cancelled}</strong>
          <span>Cancelled projects</span>
        </div>
      </article>
    </div>
  );
};

export default ProjectGrid;
