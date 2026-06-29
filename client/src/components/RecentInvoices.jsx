const RecentInvoices = ({ data }) => {
  const formattedDate = data?.dueDate?.split("T")[0] || "";

  return (
    <tr>
      <td># {data?.invoiceNumber}</td>
      <td>{data?.client?.name}</td>
      <td>{formattedDate}</td>
      <td>$ {data?.amount}</td>
      <td
        className={`${data?.status === "pending" ? "pending" : data?.status === "paid" ? "paid" : data?.status === "overdue" ? "overdue" : "cancelled"}`}
      >
        <span>{data?.status}</span>
      </td>
      <td>...</td>
    </tr>
  );
};

export default RecentInvoices;
