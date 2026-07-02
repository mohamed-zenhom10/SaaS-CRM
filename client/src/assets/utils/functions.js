import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportDashboardPDF = (dashboard) => {
  const doc = new jsPDF("p", "mm", "a4");

  const PRIMARY = [41, 98, 255];
  const DARK = [33, 33, 33];
  const GRAY = [120, 120, 120];

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("CRM Dashboard Report", 14, 18);

  doc.setTextColor(...GRAY);
  doc.setFontSize(10);

  const now = new Date();

  doc.text(
    `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
    14,
    36,
  );

  doc.setTextColor(...DARK);

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, 48);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    "This report provides an overview of your CRM activity including clients, projects, tasks, invoices, revenue and upcoming deadlines.",
    14,
    56,
    {
      maxWidth: 180,
    },
  );

  autoTable(doc, {
    startY: 70,

    head: [["Metric", "Value"]],

    body: [
      ["Total Clients", dashboard.totalClients],
      ["Total Projects", dashboard.totalProjects],
      ["Total Tasks", dashboard.totalTasks],
      ["Completed Tasks", dashboard.completedTasks],
      ["Pending Tasks", dashboard.pendingTasks],
      ["Overdue Tasks", dashboard.overdueTasks],
      ["Completed Projects", dashboard.completedProjects],
      ["Pending Projects", dashboard.pendingProjects],
      ["Total Revenue", `$${dashboard.totalRevenue}`],
      ["Pending Payments", `$${dashboard.pendingPayments}`],
    ],

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: PRIMARY,
      textColor: 255,
      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  let currentY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Recent Invoices", 14, currentY);

  currentY += 5;

  if (dashboard.recentInvoices.length > 0) {
    autoTable(doc, {
      startY: currentY,

      head: [["Invoice", "Client", "Amount", "Status", "Date"]],

      body: dashboard.recentInvoices.map((invoice) => [
        invoice.invoiceNumber || invoice.number,
        invoice.clientName,
        `$${invoice.amount}`,
        invoice.status,
        invoice.createdAt
          ? new Date(invoice.createdAt).toLocaleDateString()
          : "-",
      ]),

      headStyles: {
        fillColor: PRIMARY,
      },

      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
    });

    currentY = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No recent invoices available.", 14, currentY + 8);
    currentY += 18;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Upcoming Deadlines", 14, currentY);

  currentY += 5;

  if (dashboard.upcomingDeadlines.length > 0) {
    autoTable(doc, {
      startY: currentY,

      head: [["Project", "Deadline", "Status"]],

      body: dashboard.upcomingDeadlines.map((item) => [
        item.projectName,
        new Date(item.deadline).toLocaleDateString(),
        item.status,
      ]),

      headStyles: {
        fillColor: PRIMARY,
      },

      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("No upcoming deadlines.", 14, currentY + 8);
  }

  const pages = doc.getNumberOfPages();

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);

    doc.setDrawColor(220);
    doc.line(10, 287, 200, 287);

    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text(`Page ${i} of ${pages}`, 105, 293, {
      align: "center",
    });
  }

  doc.save(`dashboard-report-${Date.now()}.pdf`);
};
