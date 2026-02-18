import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Customer management view will be added here.
      </CardContent>
    </Card>
  );
}
