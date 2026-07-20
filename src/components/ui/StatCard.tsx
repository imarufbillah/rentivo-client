import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}
        >
          {trend.isPositive ? "+" : ""}
          {trend.value}% from last month
        </p>
      )}
    </div>
  );
};
