/* eslint-disable no-unused-vars */
import React from "react";
import useInvoiceActions from "../hooks/useInvoiceActions";
import { FiCalendar, FiFileText, FiEdit, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../assets/utils/Common";
import { formatCurrency } from "../assets/utils/Common";
import { useNavigate } from "react-router-dom";
const getStatusLabel = (status) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};
const InvoiceTable = ({
  deletingInvoiceId,
  updatingInvoiceId,
  isLoading,
  pageInvoices,
  STATUS_OPTIONS,
  setDeletingInvoiceId,
  setInvoices,
  setUpdatingInvoiceId,
  currentPage,
  invoices,
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
}) => {
  const navigate = useNavigate();

  const { handleStatusChange, deleteInvoice } = useInvoiceActions({
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

  return (
    <table>
      <thead>
        <tr>
          <th>Invoice Number</th>
          <th>Client</th>
          <th>Related Project</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="7" className="invoices-table-empty">
              Loading invoices...
            </td>
          </tr>
        ) : pageInvoices.length ? (
          pageInvoices.map((invoice) => (
            <tr key={invoice._id || invoice.id}>
              <td>
                <div className="invoice-number-cell">
                  <span>
                    <FiFileText />
                  </span>
                  <strong>{invoice.invoiceNumber}</strong>
                </div>
              </td>

              <td>
                <div className="invoice-client-cell">
                  <span>
                    {invoice.client?.name?.slice(0, 1).toUpperCase() || "?"}
                  </span>
                  <p>{invoice.client?.name || "No client"}</p>
                </div>
              </td>

              <td>{invoice.project?.title || "No project"}</td>

              <td>
                <strong className="invoice-amount">
                  {formatCurrency(invoice.amount)}
                </strong>
              </td>

              <td>
                <span className="invoice-date">
                  <FiCalendar />
                  {formatDate(invoice.dueDate)}
                </span>
              </td>

              <td>
                <span
                  className={`invoice-status invoice-status--${invoice.status}`}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleStatusChange(
                      invoice._id || invoice.id,
                      invoice.status,
                    )
                  }
                  title="Click to change status"
                >
                  {updatingInvoiceId === (invoice._id || invoice.id)
                    ? "Updating..."
                    : getStatusLabel(invoice.status)}
                </span>
              </td>

              <td>
                <div className="invoice-actions">
                  <button
                    type="button"
                    className="invoice-action-button invoice-action-button--edit"
                    onClick={() => {
                      navigate(
                        `/layout/invoices/edit/${invoice._id || invoice.id}`,
                      );
                    }}
                    title="Edit invoice"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    className="invoice-action-button invoice-action-button--delete"
                    onClick={() => deleteInvoice(invoice._id || invoice.id)}
                    disabled={deletingInvoiceId === (invoice._id || invoice.id)}
                    title="Delete invoice"
                  >
                    {deletingInvoiceId === (invoice._id || invoice.id) ? (
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
            <td colSpan="7" className="invoices-table-empty">
              No invoices match the selected filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
