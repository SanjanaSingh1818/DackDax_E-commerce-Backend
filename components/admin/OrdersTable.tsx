"use client";

import { FileDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminOrder } from "@/lib/admin-api";
import { formatSEK } from "@/lib/currency";

const statusClassMap = {
  Completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  Cancelled: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

const statusLabelMap = {
  Completed: "Slutford",
  Pending: "Vantar",
  Cancelled: "Avbruten",
};

const customerTypeLabelMap = {
  privat: "Privat",
  foretag: "Foretag",
};

export default function OrdersTable({ rows }: { rows: AdminOrder[] }) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const downloadInvoice = (order: AdminOrder) => {
    const orderId = escapeHtml(order.orderId);
    const customerName = escapeHtml(order.customerName);
    const productName = escapeHtml(order.productName);
    const date = escapeHtml(order.date);
    const status = escapeHtml(order.status);

    const invoiceHtml = `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <title>Faktura ${order.orderId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
    .wrap { max-width: 720px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
    .title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
    .sub { color: #6b7280; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .row:last-child { border-bottom: 0; }
    .key { color: #6b7280; }
    .value { font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">DackDax Faktura</div>
    <div class="sub">Skapad fran adminpanelen</div>
    <div class="row"><span class="key">Ordernummer</span><span class="value">${orderId}</span></div>
    <div class="row"><span class="key">Kund</span><span class="value">${customerName}</span></div>
    <div class="row"><span class="key">Produkt</span><span class="value">${productName}</span></div>
    <div class="row"><span class="key">Datum</span><span class="value">${date}</span></div>
    <div class="row"><span class="key">Status</span><span class="value">${status}</span></div>
    <div class="row"><span class="key">Belopp</span><span class="value">${formatSEK(order.price)}</span></div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `faktura-${order.orderId.replace(/[^a-zA-Z0-9-]/g, "")}.html`;
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bestallningar & Fakturor</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              <TableHead>Ordernummer</TableHead>
              <TableHead>Kund</TableHead>
              <TableHead>Kundtyp</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Faktura</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                  Inga bestallningar hittades
                </TableCell>
              </TableRow>
            ) : (
              rows.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="max-w-[160px] truncate font-medium">{order.orderId}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{order.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {customerTypeLabelMap[order.customerType || "privat"]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatSEK(order.price)}</TableCell>
                  <TableCell>
                    <Badge className={statusClassMap[order.status]}>
                      {statusLabelMap[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => downloadInvoice(order)}
                    >
                      <FileDown className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Ladda ner</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
