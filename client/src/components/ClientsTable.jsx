/* eslint-disable no-unused-vars */
import React from "react";
import { getInitials } from "../assets/utils/Common";
import { formatCurrency } from "../assets/utils/Common";
import { getStatusColor } from "../assets/utils/Common";
import { FiTrash2 } from "react-icons/fi";
const ClientsTable = ({
  clients,
  loadingDetails,
  STATUS_OPTIONS,
  updateClientStatus,
  updatingStatus,
  deleteClient,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Company</th>
          <th>Contact</th>
          <th>Projects</th>
          <th>Total Value</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {clients.length ? (
          clients.map((client) => (
            <tr key={client.id}>
              <td>
                <div className="clients-table-profile">
                  <span className="client-avatar">
                    {getInitials(client.name)}
                  </span>

                  <div>
                    <strong>{client.name}</strong>
                    <small>{client.email}</small>
                  </div>
                </div>
              </td>

              <td>{client.company || "—"}</td>
              <td>{client.phone || "—"}</td>
              <td>
                {loadingDetails[client.id] ? (
                  <span className="loading-dots">...</span>
                ) : (
                  client.projects || 0
                )}
              </td>
              <td>
                {loadingDetails[client.id] ? (
                  <span className="loading-dots">...</span>
                ) : (
                  formatCurrency(client.totalValue)
                )}
              </td>

              <td>
                <div className="client-status-dropdown-wrapper">
                  <select
                    className={`client-status client-status--${client.status}`}
                    value={client.status}
                    onChange={(e) =>
                      updateClientStatus(client.id, e.target.value)
                    }
                    disabled={updatingStatus === client.id}
                    style={{
                      backgroundColor: getStatusColor(client.status),
                      color: "white",
                      border: "none",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: updatingStatus === client.id ? "wait" : "pointer",
                      textTransform: "capitalize",
                      minWidth: "70px",
                      appearance: "auto",
                    }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                        style={{
                          backgroundColor: "white",
                          color: "black",
                        }}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  {updatingStatus === client.id && (
                    <span className="status-updating-spinner">⟳</span>
                  )}
                </div>
              </td>

              <td className="clients-table-action">
                <button
                  type="button"
                  onClick={() => deleteClient(client.id)}
                  title={`Delete ${client.name}`}
                  aria-label={`Delete ${client.name}`}
                  disabled={updatingStatus === client.id}
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="clients-table-empty">
              No clients match your search.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ClientsTable;
