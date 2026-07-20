import { cn } from "@/lib/utils";

type StatusVariant = "active" | "pending" | "rented" | "archived" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  rented: "bg-info/10 text-info border-info/20",
  archived: "bg-muted text-muted-foreground border-border",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
};
