export const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return headers;
};

export const getApiError = (payload) =>
  payload?.errors?.[0]?.msg ||
  payload?.message ||
  "Something went wrong. Please try again.";

export const PAGE_SIZE = 6;

export const formatDate = (dateValue) => {
  if (!dateValue) return "No deadline";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const getClientName = (client) => {
  if (!client || typeof client !== "object") return "No client";
  return client.name || "No client";
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    cancelld: "Cancelled",
  };
  return labels[status] || status;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const getStatusColor = (status) => {
  switch (status) {
    case "lead":
      return "#f59e0b";
    case "active":
      return "#10b981";
    case "inactive":
      return "#6b7280";
    default:
      return "#6b7280";
  }
};
