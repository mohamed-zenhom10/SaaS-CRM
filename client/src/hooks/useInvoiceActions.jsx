/* eslint-disable no-unused-vars */
import React from "react";
import { success, failed } from "../assets/utils/Toasts";
import { getAuthHeaders } from "../assets/utils/Common";
import { getApiError } from "../assets/utils/Common";
import { PAGE_SIZE } from "../assets/utils/Common";
import { API_RUL } from "../api/api";
const useInvoiceActions = ({
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
}) => {
  const loadInvoices = async (
    page = 1,
    status = "all",
    sort = "dueDate",
    search = "",
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (status !== "all") {
        params.append("status", status);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (sort === "dueDate") {
        params.append("sort", "dueDate");
      } else if (sort === "newest") {
        params.append("sort", "-createdAt");
      } else if (sort === "amount") {
        params.append("sort", "-amount");
      } else if (sort === "client") {
        params.append("sort", "client.name");
      }

      const response = await fetch(
        `${API_RUL}/api/v1/invoices?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      const invoicesData = Array.isArray(payload.data) ? payload.data : [];

      setInvoices(invoicesData);
      setTotalInvoices(payload["total documents"] || invoicesData.length);

      if (payload.paginationResult) {
        setCurrentPage(payload.paginationResult.currentPage || 1);
        setTotalPages(payload.paginationResult.pageCount || 1);
        setLimit(payload.paginationResult.limit || PAGE_SIZE);
      } else {
        setTotalPages(Math.ceil(invoicesData.length / limit));
      }
    } catch (error) {
      setError(error.message || "Unable to load invoices.");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    setUpdatingInvoiceId(invoiceId);

    try {
      const response = await fetch(
        `${API_RUL}/api/v1/invoices/${invoiceId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === invoiceId || invoice.id === invoiceId
            ? { ...invoice, status: newStatus }
            : invoice,
        ),
      );

      success(`Invoice status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      failed(error.message || "Failed to update invoice status");
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    const invoice = invoices.find(
      (inv) => inv._id === invoiceId || inv.id === invoiceId,
    );

    if (
      !window.confirm(
        `Are you sure you want to delete invoice "${invoice?.invoiceNumber || "this invoice"}"?`,
      )
    ) {
      return;
    }

    setDeletingInvoiceId(invoiceId);

    try {
      const response = await fetch(
        `${API_RUL}/api/v1/invoices/${invoiceId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(getApiError(payload));
      }

      setInvoices((prevInvoices) =>
        prevInvoices.filter(
          (inv) => inv._id !== invoiceId && inv.id !== invoiceId,
        ),
      );

      success("Invoice deleted successfully");
      loadInvoices(currentPage, statusFilter, sortBy, searchValue);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      failed(error.message || "Failed to delete invoice");
    } finally {
      setDeletingInvoiceId(null);
    }
  };

  const handleStatusChange = (invoiceId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateInvoiceStatus(invoiceId, newStatus);
  };

  return {
    updateInvoiceStatus,
    deleteInvoice,
    handleStatusChange,
    loadInvoices,
  };
};

export default useInvoiceActions;
