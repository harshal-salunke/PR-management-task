import type { PRStatus } from "../types";
export default function StatusBadge({ status }: { status: PRStatus }) {
  const styles: Record<PRStatus, string> = {
    Draft: "bg-slate-100 text-slate-600",
    "Pending Approval": "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${status === "Draft" ? "bg-slate-400" : status === "Pending Approval" ? "bg-amber-500" : status === "Approved" ? "bg-emerald-500" : "bg-rose-500"}`}
      />
      {status}
    </span>
  );
}
