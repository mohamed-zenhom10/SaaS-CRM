/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPlus,
  FiSearch,
  FiUsers,
} from "react-icons/fi";
import "./Clients.css";

import { PAGE_SIZE } from "../../assets/utils/Common";
import useClientActions from "../../hooks/useClientActions";
import ClientsTable from "../../components/ClientsTable";

const STATUS_OPTIONS = ["lead", "active", "inactive"];

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  const [totalClients, setTotalClients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeClientsCount, setActiveClientsCount] = useState(0);

  const { updateClientStatus, deleteClient, fetchClients } = useClientActions({
    setUpdatingStatus,
    setClients,
    setActiveClientsCount,
    clients,
    sortBy,
    currentPage,
    searchValue,
    setLoadingDetails,
    setLoading,
    setError,
    setTotalClients,
    setCurrentPage,
    setTotalPages,
  });

  useEffect(() => {
    fetchClients(1, searchValue, sortBy);
  }, []);

  const changePage = (nextPage) => {
    const validPage = Math.min(Math.max(nextPage, 1), totalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      fetchClients(validPage, searchValue, sortBy);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchClients(1, searchValue, sortBy);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setCurrentPage(1);
    fetchClients(1, searchValue, sortBy);
  }, [sortBy]);

  if (loading && clients.length === 0) {
    return (
      <section className="clients-page">
        <div className="container">
          <div className="clients-page__header">
            <div>
              <p className="clients-page__eyebrow">CRM Workspace</p>
              <h1>Clients</h1>
              <p>Loading clients...</p>
            </div>
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </section>
    );
  }

  if (error && clients.length === 0) {
    return (
      <section className="clients-page">
        <div className="container">
          <div className="clients-page__header">
            <div>
              <p className="clients-page__eyebrow">CRM Workspace</p>
              <h1>Clients</h1>
              <p>Error loading clients</p>
            </div>
          </div>
          <div className="error-state">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => fetchClients(1, searchValue, sortBy)}
              className="clients-button clients-button--primary"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="clients-page">
      <div className="container">
        <div className="clients-page__header">
          <div>
            <p className="clients-page__eyebrow">CRM Workspace</p>
            <h1>Clients</h1>
            <p className="qoute">
              Keep your client relationships, contact details, and project value
              organized.
            </p>
          </div>

          <button
            type="button"
            className="clients-button clients-button--primary"
            onClick={() => navigate("/layout/clients/add-new-client")}
          >
            <FiPlus />
            Add Client
          </button>
        </div>

        <div className="clients-overview">
          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--blue">
              <FiUsers />
            </div>

            <div>
              <p>Total Clients</p>
              <strong>{totalClients}</strong>
              <span>All clients in system</span>
            </div>
          </article>

          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--green">
              <FiBriefcase />
            </div>

            <div>
              <p>Active Clients</p>
              <strong>{activeClientsCount}</strong>
              <span>Currently active on this page</span>
            </div>
          </article>

          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--orange">
              <FiMail />
            </div>

            <div>
              <p>New This Month</p>
              <strong>
                {
                  clients.filter((client) => {
                    const date = new Date(client.joinedAt);
                    return date.getMonth() === new Date().getMonth();
                  }).length
                }
              </strong>
              <span>Recently added on this page</span>
            </div>
          </article>
        </div>

        <div className="clients-toolbar">
          <label className="clients-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search clients by name, company or email..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="clients-toolbar__right">
            <label className="clients-sort">
              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="-createdAt">Newest Added</option>
                <option value="name">Client Name</option>
                <option value="-totalValue">Client Value</option>
                <option value="-projects">Projects Count</option>
              </select>

              <FiChevronDown />
            </label>
          </div>
        </div>

        {loading && clients.length > 0 && (
          <div className="loading-overlay">Loading...</div>
        )}

        <div className="clients-table-card">
          <div className="clients-table-scroll">
            <ClientsTable
              updateClientStatus={updateClientStatus}
              deleteClient={deleteClient}
              STATUS_OPTIONS={STATUS_OPTIONS}
              updatingStatus={updatingStatus}
              loadingDetails={loadingDetails}
              clients={clients}
            />
          </div>
        </div>

        {totalClients > 0 && (
          <div className="clients-pagination">
            <p>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, totalClients)} of{" "}
              {totalClients} clients
            </p>

            <div>
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Clients;
