/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import "./Invoices.css";
import { PAGE_SIZE } from "../../assets/utils/Common";
import { formatCurrency } from "../../assets/utils/Common";
import useInvoiceActions from "../../hooks/useInvoiceActions";
import InvoiceTable from "../../components/InvoiceTable";

const getStatusLabel = (status) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const STATUS_OPTIONS = ["pending", "paid", "overdue", "cancelled"];

const Invoices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState(null);

  const { loadInvoices } = useInvoiceActions({
    STATUS_OPTIONS,
    setDeletingInvoiceId,
    setUpdatingInvoiceId,
    setInvoices,
    currentPage,
    invoices,
    getStatusLabel,
    statusFilter,
    sortBy,
    searchValue,
    setIsLoading,
    setError,
    limit,
    setCurrentPage,
    setTotalInvoices,
    setTotalPages,
    setLimit,
  });

  useEffect(() => {
    loadInvoices(1, statusFilter, sortBy, searchValue);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadInvoices(currentPage, statusFilter, sortBy, searchValue);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadInvoices(1, statusFilter, sortBy, searchValue);
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadInvoices(1, statusFilter, sortBy, searchValue);
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadInvoices(newPage, statusFilter, sortBy, searchValue);
    }
  };

  const pageInvoices = invoices;
  const startIndex = (currentPage - 1) * limit;

  const paidAmount = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const pendingAmount = invoices
    .filter((invoice) => ["pending", "overdue"].includes(invoice.status))
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const overdueAmount = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  return (
    <section className="invoices-page">
      <div className="container">
        <div className="invoices-page__header">
          <div>
            <p className="invoices-page__eyebrow">Financial Workspace</p>
            <h1>Invoices</h1>
            <p>
              Create, track, and organize invoices for all your client projects.
            </p>
          </div>

          <button
            type="button"
            className="invoices-button invoices-button--primary"
            onClick={() => navigate("/layout/invoices/add-new-invoice")}
          >
            <FiPlus />
            Create Invoice
          </button>
        </div>

        <div className="invoices-summary">
          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--blue">
              <FiDollarSign />
            </div>

            <div>
              <p>Total Paid</p>
              <strong>{formatCurrency(paidAmount)}</strong>
              <span>Received from paid invoices</span>
            </div>
          </article>

          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--yellow">
              <FiClock />
            </div>

            <div>
              <p>Outstanding</p>
              <strong>{formatCurrency(pendingAmount)}</strong>
              <span>Pending and overdue invoices</span>
            </div>
          </article>

          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--red">
              <FiFileText />
            </div>

            <div>
              <p>Overdue</p>
              <strong>{formatCurrency(overdueAmount)}</strong>
              <span>
                {
                  invoices.filter((invoice) => invoice.status === "overdue")
                    .length
                }{" "}
                invoices need attention
              </span>
            </div>
          </article>
        </div>

        <div className="invoices-toolbar">
          <label className="invoices-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search by invoice number, client or project..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="invoices-toolbar__filters">
            <label className="invoices-select">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <FiChevronDown />
            </label>

            <label className="invoices-sort">
              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="newest">Newest</option>
                <option value="amount">Amount</option>
                <option value="client">Client</option>
              </select>

              <FiChevronDown />
            </label>
          </div>
        </div>

        {error && (
          <div className="invoices-message invoices-message--error">
            {error}
          </div>
        )}

        <div className="invoices-table-card">
          <div className="invoices-table-scroll">
            <InvoiceTable
              deletingInvoiceId={deletingInvoiceId}
              updatingInvoiceId={updatingInvoiceId}
              pageInvoices={pageInvoices}
              isLoading={isLoading}
              STATUS_OPTIONS={STATUS_OPTIONS}
              setDeletingInvoiceId={setDeletingInvoiceId}
              setInvoices={setInvoices}
              setUpdatingInvoiceId={setUpdatingInvoiceId}
              currentPage={currentPage}
              invoices={invoices}
              statusFilter={statusFilter}
              sortBy={sortBy}
              searchValue={searchValue}
              setIsLoading={setIsLoading}
              setError={setError}
              limit={limit}
              setCurrentPage={setCurrentPage}
              setTotalInvoices={setTotalInvoices}
              setTotalPages={setTotalPages}
              setLimit={setLimit}
            />
          </div>
        </div>

        {!isLoading && totalInvoices > 0 && (
          <div className="invoices-pagination">
            <p>
              Showing {startIndex + 1}–
              {Math.min(startIndex + limit, totalInvoices)} of {totalInvoices}{" "}
              invoices
            </p>

            <div>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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

export default Invoices;
