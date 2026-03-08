import { type FormEvent, useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button, Card, DataTable, Input, Modal } from "@/components/ui-kit";
import { useCreateFeedMetric, useFeedMetrics } from "@/hooks/use-poultry";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

export default function FeedManagement() {
  const { data: records, isLoading } = useFeedMetrics();
  const { mutateAsync: createFeedMetric, isPending } = useCreateFeedMetric();

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: today,
    openingStockKg: "",
    feedAddedKg: "",
    feedConsumedKg: "",
    feedCost: "",
    notes: "",
  });

  const closingStockKg = useMemo(() => {
    const opening = Number(formData.openingStockKg || 0);
    const added = Number(formData.feedAddedKg || 0);
    const consumed = Number(formData.feedConsumedKg || 0);
    return Math.max(0, opening + added - consumed);
  }, [formData.feedAddedKg, formData.feedConsumedKg, formData.openingStockKg]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createFeedMetric({
      date: formData.date,
      openingStockKg: Number(formData.openingStockKg || 0),
      feedAddedKg: Number(formData.feedAddedKg || 0),
      feedConsumedKg: Number(formData.feedConsumedKg || 0),
      closingStockKg,
      feedCost: Number(formData.feedCost || 0),
      notes: formData.notes || "",
    });

    setIsOpen(false);
    setFormData({
      date: today,
      openingStockKg: "",
      feedAddedKg: "",
      feedConsumedKg: "",
      feedCost: "",
      notes: "",
    });
  }

  return (
    <AppLayout>
      <PageHeader
        title="Feed Management"
        description="Track daily feed stock, feed consumption, and feed cost."
        action={
          <Button onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            Add Feed Log
          </Button>
        }
      />

      <Card className="mb-6">
        <p className="text-sm text-muted-foreground">
          Low-feed alert threshold is configured on backend using `FEED_STOCK_ALERT_THRESHOLD_KG`
          (default 10 kg).
        </p>
      </Card>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading feed records...</div>
      ) : (
        <DataTable
          headers={[
            "Date",
            "Opening (kg)",
            "Added (kg)",
            "Consumed (kg)",
            "Closing (kg)",
            "Feed Cost",
            "Notes",
          ]}
        >
          {(records ?? []).map((record) => (
            <tr key={record.id} className="hover:bg-black/5 transition-colors">
              <td className="px-6 py-4">{formatDate(record.date)}</td>
              <td className="px-6 py-4">{Number(record.openingStockKg).toFixed(1)}</td>
              <td className="px-6 py-4">{Number(record.feedAddedKg).toFixed(1)}</td>
              <td className="px-6 py-4">{Number(record.feedConsumedKg).toFixed(1)}</td>
              <td className="px-6 py-4 font-semibold">{Number(record.closingStockKg).toFixed(1)}</td>
              <td className="px-6 py-4">{formatCurrency(record.feedCost)}</td>
              <td className="px-6 py-4">{record.notes || "-"}</td>
            </tr>
          ))}
          {(!records || records.length === 0) && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                No feed logs found.
              </td>
            </tr>
          )}
        </DataTable>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Feed Log">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Opening Stock (kg)"
              type="number"
              min="0"
              step="0.1"
              required
              value={formData.openingStockKg}
              onChange={(e) => setFormData((prev) => ({ ...prev, openingStockKg: e.target.value }))}
            />
            <Input
              label="Feed Added (kg)"
              type="number"
              min="0"
              step="0.1"
              required
              value={formData.feedAddedKg}
              onChange={(e) => setFormData((prev) => ({ ...prev, feedAddedKg: e.target.value }))}
            />
            <Input
              label="Feed Consumed (kg)"
              type="number"
              min="0"
              step="0.1"
              required
              value={formData.feedConsumedKg}
              onChange={(e) => setFormData((prev) => ({ ...prev, feedConsumedKg: e.target.value }))}
            />
          </div>
          <Input label="Closing Stock (kg)" value={closingStockKg.toFixed(1)} readOnly />
          <Input
            label="Feed Cost (INR)"
            type="number"
            min="0"
            step="0.01"
            value={formData.feedCost}
            onChange={(e) => setFormData((prev) => ({ ...prev, feedCost: e.target.value }))}
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          />

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Saving..." : "Save Feed Log"}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
}
