import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Transaction = {
  orderId: string;
  productName: string;
  customer: string;
  date: string;
  price: string;
  status: "Completed" | "Pending" | "Cancelled";
};

const statusClasses: Record<Transaction["status"], string> = {
  Completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  Cancelled: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item) => (
              <TableRow key={item.orderId}>
                <TableCell className="font-medium">{item.orderId}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <Badge className={statusClasses[item.status]}>{item.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
