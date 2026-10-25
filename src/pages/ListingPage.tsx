import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Clock3,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
} from "lucide-react";
import { useRequisitions } from "../context/RequisitionContext";
import StatusBadge from "../components/StatusBadge";
import type { PRStatus } from "../types";
const PAGE_SIZE = 5;
export default function ListingPage() {
  const { requisitions } = useRequisitions();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState(false);
  const filtered = useMemo(
    () =>
      requisitions
        .filter(
          (r) =>
            r.prNumber.toLowerCase().includes(search.toLowerCase().trim()) &&
            (status === "All statuses" || r.status === status) &&
            (!from || r.requestDate >= from) &&
            (!to || r.requestDate <= to),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requisitions, search, status, from, to],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const selected = requisitions.find((r) => r.id === viewId);
  const reset = () => {
    setSearch("");
    setStatus("All statuses");
    setFrom("");
    setTo("");
    setPage(1);
    setSimulateError(false);
  };
  const stats = [
    {
      label: "Total requisitions",
      value: requisitions.length,
      icon: ClipboardList,
      tint: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending approval",
      value: requisitions.filter((r) => r.status === "Pending Approval").length,
      icon: Clock3,
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved",
      value: requisitions.filter((r) => r.status === "Approved").length,
      icon: CheckCircle2,
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Drafts",
      value: requisitions.filter((r) => r.status === "Draft").length,
      icon: FileText,
      tint: "bg-violet-50 text-violet-600",
    },
  ];
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />{" "}
            PROCUREMENT WORKSPACE
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
            Purchase requisitions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create, track and manage your material requests in one place.
          </p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus size={17} /> New requisition
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft md:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 md:text-sm">
                {s.label}
              </span>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ${s.tint}`}
              >
                <s.icon size={18} />
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Across all departments
            </div>
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">All requisitions</h2>
              <p className="mt-1 text-xs text-slate-400">
                Review and manage your purchase requests
              </p>
            </div>
            <span className="w-fit rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              {filtered.length} records
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <label className="relative block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search PR number..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500"
              />
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-brand-500 cursor-pointer"
            >
              <option>All statuses</option>
              <option>Draft</option>
              <option>Pending Approval</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
            <label className="relative">
              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                aria-label="From date"
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-2 text-sm text-slate-600 outline-none focus:border-brand-500 cursor-pointer"
              />
            </label>
            <label className="relative">
              <CalendarDays
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                aria-label="To date"
                type="date"
                min={from || undefined}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-2 text-sm text-slate-600 outline-none focus:border-brand-500 cursor-pointer"
              />
            </label>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>
        </div>
        {simulateError ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-600">
              !
            </div>
            <h3 className="mt-4 font-bold">Unable to load requisitions</h3>
            <p className="mt-1 text-sm text-slate-500">
              Something went wrong while fetching records.
            </p>
            <button
              onClick={() => setSimulateError(false)}
              className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[830px] text-left">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[.09em] text-slate-400">
                  <tr>
                    {[
                      "PR number",
                      "Request date",
                      "Department",
                      "Requested by",
                      "Status",
                      "Total items",
                      "Actions",
                    ].map((h) => (
                      <th key={h} className="px-5 py-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((r) => (
                    <tr key={r.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-brand-700">
                          {r.prNumber}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-400">
                          Purchase request
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(
                          `${r.requestDate}T00:00:00`,
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {r.department}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            {r.requestedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-700">
                            {r.requestedBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status as PRStatus} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                          {r.items.length} items
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            aria-label={`View ${r.prNumber}`}
                            onClick={() => setViewId(r.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            aria-label={`Edit ${r.prNumber}`}
                            onClick={() => navigate(`/edit/${r.id}`)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible.length === 0 && (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <Search size={20} />
                </div>
                <h3 className="mt-4 font-bold text-slate-800">
                  No requisitions found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Try changing your search or filters, or create a new purchase
                  requisition.
                </p>
                <button
                  onClick={reset}
                  className="mt-4 text-sm font-semibold text-brand-700"
                >
                  Clear all filters
                </button>
              </div>
            )}
            <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <strong>
                  {visible.length ? (safePage - 1) * PAGE_SIZE + 1 : 0}–
                  {(safePage - 1) * PAGE_SIZE + visible.length}
                </strong>{" "}
                of <strong>{filtered.length}</strong> requisitions
              </p>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous page"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold ${n === safePage ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  aria-label="Next page"
                  disabled={safePage === pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setViewId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  Requisition details
                </p>
                <h2 id="detail-title" className="mt-1 text-xl font-bold">
                  {selected.prNumber}
                </h2>
              </div>
              <button
                onClick={() => setViewId(null)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Request date", selected.requestDate],
                ["Department", selected.department],
                ["Requested by", selected.requestedBy],
                ["Priority", selected.priority],
                ["Status", selected.status],
                ["Total items", String(selected.items.length)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-400">{k}</div>
                  <div className="mt-1 text-sm font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <h3 className="mb-2 mt-6 font-bold">Material items</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Material</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Required date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selected.items.map((i) => (
                    <tr key={i.id}>
                      <td className="p-3 font-medium">{i.materialCode}</td>
                      <td className="p-3">{i.materialName}</td>
                      <td className="p-3">{i.quantity}</td>
                      <td className="p-3">{i.requiredDate || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
