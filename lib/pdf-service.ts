import type { Order } from "./api-service";

// Format money as IDR
function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateOrderReceipt(order: Order): Promise<void> {
  // Dynamically import jsPDF to avoid SSR issues
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ─── HEADER BAR ───────────────────────────────────────────────────────────────
  doc.setFillColor(10, 77, 160); // EMOBO blue
  doc.rect(0, 0, pageWidth, 40, "F");

  // Brand name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("EMOBO.", margin, 26);

  // "OFFICIAL RECEIPT" label
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 210, 255);
  doc.text("OFFICIAL PURCHASE RECEIPT", pageWidth - margin, 20, { align: "right" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(`Order #${order.id}`, pageWidth - margin, 30, { align: "right" });

  // ─── STATUS BADGE ─────────────────────────────────────────────────────────────
  let statusColor: [number, number, number] = [100, 116, 139]; // default grey
  if (order.status === "COMPLETED") statusColor = [16, 185, 129];
  else if (order.status === "SHIPPED") statusColor = [59, 130, 246];
  else if (order.status === "PROCESSING") statusColor = [245, 158, 11];
  else if (order.status === "CANCELLED") statusColor = [239, 68, 68];

  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth - margin - 35, 43, 35, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(order.status, pageWidth - margin - 17.5, 49, { align: "center" });

  // ─── ORDER META ───────────────────────────────────────────────────────────────
  let y = 60;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Order Date
  doc.setTextColor(100, 116, 139);
  doc.text("Order Date:", margin, y);
  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.text(formatDate(order.createdAt), margin + 28, y);

  // Payment Method (right-aligned pair)
  if (order.payment?.paymentMethod) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Method:", pageWidth - margin - 60, y);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(order.payment.paymentMethod, pageWidth - margin, y, { align: "right" });
  }

  y += 7;
  if (order.payment?.paidAt) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Paid At:", margin, y);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.text(formatDate(order.payment.paidAt), margin + 28, y);
  }

  // Shipping service right-side
  if (order.shippingService) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Shipping Service:", pageWidth - margin - 60, y);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(order.shippingService, pageWidth - margin, y, { align: "right" });
  }

  // ─── DIVIDER ──────────────────────────────────────────────────────────────────
  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ─── CUSTOMER & SHIPPING ADDRESS ──────────────────────────────────────────────
  const addr = order.shippingAddress || order.shippingAddr;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 77, 160);
  doc.text("DELIVERY ADDRESS", margin + 4, y + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(addr?.fullName || order.user?.name || "-", margin + 4, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const addressLine = [
    addr?.address,
    addr?.city ? `${addr.city}, ${addr?.province}` : null,
    addr?.postalCode,
    addr?.phone || order.phone,
  ].filter(Boolean).join("  |  ");

  doc.text(addressLine, margin + 4, y + 23, { maxWidth: contentWidth - 8 });

  if (order.trackingNo || order.trackingNumber) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 77, 160);
    doc.text(`Tracking: ${order.trackingNo || order.trackingNumber}`, margin + 4, y + 32);
  }

  y += 46;

  // ─── ORDER ITEMS TABLE ────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(10, 77, 160);
  doc.text("ORDER ITEMS", margin, y);
  y += 4;

  const tableRows = (order.items || []).map((item) => [
    item.product?.sku || "-",
    item.product?.name || `Product #${item.productId}`,
    String(item.quantity),
    formatIDR(item.price || item.unitPrice),
    formatIDR((item.price || item.unitPrice) * item.quantity),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["SKU", "Product Name", "Qty", "Unit Price", "Subtotal"]],
    body: tableRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [30, 30, 30],
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [10, 77, 160],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 28 },
      1: { cellWidth: "auto" },
      2: { halign: "center", cellWidth: 12 },
      3: { halign: "right", cellWidth: 32 },
      4: { halign: "right", cellWidth: 35 },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // ─── PRICING SUMMARY ──────────────────────────────────────────────────────────
  const subtotal = order.totalAmount - order.shippingCost - (order.taxAmount || 0) - (order.appFee || 0);

  const summaryItems: [string, string][] = [
    ["Subtotal", formatIDR(subtotal)],
    ["Shipping Cost", formatIDR(order.shippingCost)],
  ];
  if ((order.taxAmount ?? 0) > 0) summaryItems.push(["Tax (PPN 11%)", formatIDR(order.taxAmount!)]);
  if ((order.appFee ?? 0) > 0) summaryItems.push(["App Fee", formatIDR(order.appFee!)]);

  const summaryBoxWidth = 80;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, y, summaryBoxWidth, summaryItems.length * 7 + 16, 3, 3, "F");

  let sy = y + 7;
  doc.setFontSize(9);
  summaryItems.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(label, summaryX + 4, sy);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(value, summaryX + summaryBoxWidth - 4, sy, { align: "right" });
    sy += 7;
  });

  // Divider above total
  doc.setDrawColor(226, 232, 240);
  doc.line(summaryX + 4, sy - 1, summaryX + summaryBoxWidth - 4, sy - 1);
  sy += 3;

  // Grand Total
  doc.setFillColor(10, 77, 160);
  doc.roundedRect(summaryX, sy - 4, summaryBoxWidth, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("GRAND TOTAL", summaryX + 4, sy + 3);
  doc.text(formatIDR(order.totalAmount), summaryX + summaryBoxWidth - 4, sy + 3, { align: "right" });

  // ─── FOOTER ───────────────────────────────────────────────────────────────────
  doc.setFillColor(10, 77, 160);
  doc.rect(0, pageHeight - 18, pageWidth, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("EMOBO. — Premium Laptops", margin, pageHeight - 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 210, 255);
  doc.text("Thank you for shopping with us! This is an receipt.", pageWidth / 2, pageHeight - 7, { align: "center" });
  doc.text(
    `Generated: ${new Date().toLocaleString("id-ID")}`,
    pageWidth - margin,
    pageHeight - 7,
    { align: "right" }
  );

  // Save
  doc.save(`EMOBO-Receipt-Order-${order.id}.pdf`);
}
