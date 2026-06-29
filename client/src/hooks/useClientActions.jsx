/* eslint-disable no-unused-vars */
import React from "react";
import { success, failed } from "../assets/utils/Toasts";
import { PAGE_SIZE } from "../assets/utils/Common";
const useClientActions = ({
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
}) => {
  const updateClientStatus = async (clientId, newStatus) => {
    try {
      setUpdatingStatus(clientId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to update client status");
      }

      const url = `http://localhost:5000/api/v1/clients/${clientId}`;
      console.log(`Updating client status at: ${url}`);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update client status: ${response.statusText}`,
        );
      }

      const result = await response.json();

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? { ...client, status: result.data?.status || newStatus }
            : client,
        ),
      );

      const oldClient = clients.find((c) => c.id === clientId);
      if (oldClient) {
        setActiveClientsCount((prevCount) => {
          if (oldClient.status !== "active" && newStatus === "active") {
            return prevCount + 1;
          } else if (oldClient.status === "active" && newStatus !== "active") {
            return prevCount - 1;
          }
          return prevCount;
        });
      }

      success(`Client status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating client status:", err);
      failed(`Failed to update client status: ${err.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteClient = async (clientId) => {
    const client = clients.find((item) => item.id === clientId);

    const shouldDelete = window.confirm(
      `Delete ${client?.name || "this client"} from the list?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to delete clients");
      }

      const url = `http://localhost:5000/api/v1/clients/${clientId}`;
      console.log(`Deleting client at: ${url}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete client: ${response.statusText}`,
        );
      }

      success("Client deleted successfully!");
      fetchClients(currentPage, searchValue, sortBy);
    } catch (err) {
      console.error("Error deleting client:", err);
      failed(`Failed to delete client: ${err.message}`);
    }
  };

  const fetchClientDetails = async (clientId) => {
    try {
      setLoadingDetails((prev) => ({ ...prev, [clientId]: true }));

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login");

      const url = `http://localhost:5000/api/v1/clients/${clientId}/details`;
      console.log(`Fetching details for client ${clientId} from:`, url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch client details`);
      }

      const result = await response.json();
      console.log("Client details response:", result);

      const stats = result.stats || {};

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? {
                ...client,
                projects: stats.totalProjects || 0,
                totalValue: stats.totalValue || 0,
              }
            : client,
        ),
      );

      return result;
    } catch (err) {
      console.error(`Error fetching details for client ${clientId}:`, err);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? {
                ...client,
                projects: 0,
                totalValue: 0,
              }
            : client,
        ),
      );
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [clientId]: false }));
    }
  };

  const fetchClients = async (page = 1, search = "", sort = "-createdAt") => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        throw new Error("Please login to view clients");
      }

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", PAGE_SIZE);

      if (search.trim()) {
        params.append("keyword", search.trim());
      }

      if (sort) {
        params.append("sort", sort);
      }

      params.append("fields", "name,email,phone,company,status,createdAt");

      const url = `http://localhost:5000/api/v1/clients?${params.toString()}`;
      console.log("Fetching clients from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch clients: ${response.statusText}`,
        );
      }

      const result = await response.json();

      const clientsData = Array.isArray(result.data) ? result.data : [];

      const transformedClients = clientsData.map((client) => ({
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone || "No phone number",
        company: client.company || "Independent client",
        notes: client.notes || "",
        projects: 0,
        totalValue: 0,
        joinedAt: client.createdAt || new Date().toISOString(),
        status: client.status || "lead",
        user: client.user,
      }));

      setClients(transformedClients);
      setTotalClients(result.totalDocuments || clientsData.length);

      const activeCount = transformedClients.filter(
        (client) => client.status === "active",
      ).length;
      setActiveClientsCount(activeCount);

      if (result.paginationResult) {
        setCurrentPage(result.paginationResult.currentPage || 1);
        setTotalPages(result.paginationResult.pageCount || 1);
      } else {
        setTotalPages(
          Math.ceil((result.totalDocuments || clientsData.length) / PAGE_SIZE),
        );
      }

      transformedClients.forEach((client) => {
        fetchClientDetails(client.id);
      });
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients. Please try again.");
      setClients([]);
      setTotalClients(0);
      setTotalPages(1);
      setActiveClientsCount(0);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateClientStatus,
    deleteClient,
    fetchClientDetails,
    fetchClients,
  };
};

export default useClientActions;
