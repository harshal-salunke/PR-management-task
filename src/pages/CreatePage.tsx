import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Save,
  Send,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useRequisitions } from "../context/RequisitionContext";
import type { MaterialItem, Priority, RequisitionFormValues } from "../types";

type FieldErrors = Record<string, string>;
const departments = [
  "Production",
  "Maintenance",
  "Procurement",
  "Quality",
  "Warehouse",
  "Finance",
  "Human Resources",
];
const blankItem = (): MaterialItem => ({
  id: crypto.randomUUID(),
  materialCode: "",
  materialName: "",
  quantity: 1,
  requiredDate: "",
  remarks: "",
});
const today = new Date().toISOString().slice(0, 10);
export default function CreatePage() {
  const { id } = useParams<{ id: string }>();
  const { requisitions, nextPRNumber, saveRequisition, updateRequisition } =
    useRequisitions();
  const navigate = useNavigate();
  const existing = id ? requisitions.find((r) => r.id === id) : undefined;
  const [requestDate, setRequestDate] = useState(
    existing?.requestDate ?? today,
  );
  const [department, setDepartment] = useState(existing?.department ?? "");
  const [requestedBy, setRequestedBy] = useState(
    existing?.requestedBy ?? "Jordan Davis",
  );
  const [priority, setPriority] = useState<Priority>(
    existing?.priority ?? "Medium",
  );
  const [items, setItems] = useState<MaterialItem[]>(
    existing?.items.map((item) => ({ ...item })) ?? [blankItem()],
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  if (id && !existing)
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        Requisition not found.{" "}
        <Link className="underline" to="/">
          Back to requisitions
        </Link>
      </div>
    );
  function updateItem(
    id: string,
    field: keyof MaterialItem,
    value: string | number,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
    setErrors((current) => {
      const next = { ...current };
      delete next[`${id}.${field}`];
      delete next.items;
      if (field === "materialCode") delete next.duplicates;
      return next;
    });
  }
  function addItem() {
    setItems((current) => [...current, blankItem()]);
  }
  function removeItem(id: string) {
    if (items.length === 1) {
      setErrors((current) => ({
        ...current,
        items: "At least one material item is required.",
      }));
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(next)
        .filter((k) => k.startsWith(`${id}.`))
        .forEach((k) => delete next[k]);
      delete next.items;
      return next;
    });
  }
  function duplicateItem(id: string) {
    const source = items.find((i) => i.id === id);
    if (source)
      setItems((current) => {
        const index = current.findIndex((i) => i.id === id);
        const copy = { ...source, id: crypto.randomUUID() };
        return [
          ...current.slice(0, index + 1),
          copy,
          ...current.slice(index + 1),
        ];
      });
  }
  function validate(): boolean {
    const next: FieldErrors = {};
    if (!requestDate) next.requestDate = "Request date is required.";
    if (!department) next.department = "Please select a department.";
    if (!requestedBy.trim()) next.requestedBy = "Requested by is required.";
    if (items.length === 0) next.items = "Add at least one material item.";
    items.forEach((item, index) => {
      const label = `Item ${index + 1}`;
      if (!item.materialCode.trim())
        next[`${item.id}.materialCode`] =
          `${label}: material code is required.`;
      if (!item.materialName.trim())
        next[`${item.id}.materialName`] =
          `${label}: material name is required.`;
      if (
        item.quantity === "" ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0
      )
        next[`${item.id}.quantity`] =
          `${label}: quantity must be greater than zero.`;
      if (!item.requiredDate)
        next[`${item.id}.requiredDate`] =
          `${label}: required date is required.`;
    });
    const codes = items
      .map((i) => i.materialCode.trim().toLowerCase())
      .filter(Boolean);
    if (new Set(codes).size !== codes.length)
      next.duplicates =
        "Duplicate material codes found. Each material code must be unique.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }
  function handleSave(action: "draft" | "submit") {
    setNotice("");
    if (action === "submit" && !validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (action === "draft") setErrors({});
    setSaving(true);
    const values: RequisitionFormValues = {
      requestDate,
      department,
      requestedBy: requestedBy.trim(),
      priority,
      items: items.map((i) => ({ ...i, quantity: Number(i.quantity) })),
    };
    try {
      const created = id
        ? updateRequisition(id, values, action)
        : saveRequisition(values, action);
      setNotice(
        `${created.prNumber} ${id ? "updated" : action === "draft" ? "saved as draft" : "submitted for approval"} successfully.`,
      );
      window.setTimeout(() => navigate("/"), 500);
    } catch {
      setErrors({ form: "Could not save the requisition. Please try again." });
    } finally {
      setSaving(false);
    }
  }
  const inputClass = (invalid?: boolean) =>
    `w-full rounded-xl border ${invalid ? "border-rose-300 bg-rose-50/30" : "border-slate-200 bg-white"} px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500`;
  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <div>
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700"
        >
          <ArrowLeft size={16} /> Back to requisitions
        </Link>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold tracking-wider text-brand-700">
              {id ? "EDIT PURCHASE REQUEST" : "NEW PURCHASE REQUEST"}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[30px]">
              {id ? "Edit requisition" : "Create requisition"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {id
                ? "Update the request details and materials below."
                : "Provide request details and add the materials your team needs."}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Requisition number
            </div>
            <div className="mt-1 font-bold text-brand-700">
              {existing?.prNumber ?? nextPRNumber}{" "}
              <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                {id ? "EXISTING" : "AUTO"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <div className="font-bold">Please review the form</div>
          <p className="mt-1">
            {errors.form ||
              errors.duplicates ||
              errors.items ||
              "Some required fields are missing or invalid. Correct the highlighted fields below."}
          </p>
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"
        >
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 md:px-7">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 font-bold text-brand-700">
            01
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Request information</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Basic details about this purchase request
            </p>
          </div>
        </div>
        <div className="grid gap-x-5 gap-y-5 p-5 md:grid-cols-2 md:p-7 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              PR number
            </span>
            <input
              value={nextPRNumber}
              readOnly
              className={`${inputClass()} cursor-not-allowed bg-slate-50 font-semibold text-slate-500`}
            />
            <span className="mt-1.5 block text-[11px] text-slate-400">
              System generated
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Request date <b className="text-rose-500">*</b>
            </span>
            <input
              type="date"
              value={requestDate}
              max={today}
              onChange={(e) => setRequestDate(e.target.value)}
              className={inputClass(!!errors.requestDate)}
            />
            {errors.requestDate && (
              <small className="mt-1 block text-xs text-rose-600">
                {errors.requestDate}
              </small>
            )}
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Department <b className="text-rose-500">*</b>
            </span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={inputClass(!!errors.department)}
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            {errors.department && (
              <small className="mt-1 block text-xs text-rose-600">
                {errors.department}
              </small>
            )}
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Priority <b className="text-rose-500">*</b>
            </span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={inputClass()}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-semibold text-slate-600">
              Requested by <b className="text-rose-500">*</b>
            </span>
            <input
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder="Enter requester's full name"
              className={inputClass(!!errors.requestedBy)}
            />
            {errors.requestedBy && (
              <small className="mt-1 block text-xs text-rose-600">
                {errors.requestedBy}
              </small>
            )}
          </label>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center md:px-7">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 font-bold text-brand-700">
              02
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Material items{" "}
                <span className="ml-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {items.length}
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Add every material needed for this request
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100"
          >
            <Plus size={16} /> Add item
          </button>
        </div>
        <div className="p-5 md:p-7">
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              Material codes must be unique within a requisition. Quantity must
              be a positive number, and all required fields must be completed
              before submission.
            </p>
          </div>
          {errors.duplicates && (
            <p className="mb-3 text-sm font-medium text-rose-600">
              {errors.duplicates}
            </p>
          )}
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 md:p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      Material line item
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Duplicate item"
                      aria-label={`Duplicate item ${index + 1}`}
                      onClick={() => duplicateItem(item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      type="button"
                      title="Remove item"
                      aria-label={`Remove item ${index + 1}`}
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Material code <b className="text-rose-500">*</b>
                    </span>
                    <input
                      value={item.materialCode}
                      onChange={(e) =>
                        updateItem(item.id, "materialCode", e.target.value)
                      }
                      placeholder="e.g. MAT-001"
                      className={inputClass(
                        !!errors[`${item.id}.materialCode`],
                      )}
                    />
                    {errors[`${item.id}.materialCode`] && (
                      <small className="mt-1 block text-xs text-rose-600">
                        Required
                      </small>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Material name <b className="text-rose-500">*</b>
                    </span>
                    <input
                      value={item.materialName}
                      onChange={(e) =>
                        updateItem(item.id, "materialName", e.target.value)
                      }
                      placeholder="e.g. Bearing"
                      className={inputClass(
                        !!errors[`${item.id}.materialName`],
                      )}
                    />
                    {errors[`${item.id}.materialName`] && (
                      <small className="mt-1 block text-xs text-rose-600">
                        Required
                      </small>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Quantity <b className="text-rose-500">*</b>
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="0"
                      className={inputClass(!!errors[`${item.id}.quantity`])}
                    />
                    {errors[`${item.id}.quantity`] && (
                      <small className="mt-1 block text-xs text-rose-600">
                        Must be &gt; 0
                      </small>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Required date <b className="text-rose-500">*</b>
                    </span>
                    <input
                      type="date"
                      value={item.requiredDate}
                      min={requestDate}
                      onChange={(e) =>
                        updateItem(item.id, "requiredDate", e.target.value)
                      }
                      className={inputClass(
                        !!errors[`${item.id}.requiredDate`],
                      )}
                    />
                    {errors[`${item.id}.requiredDate`] && (
                      <small className="mt-1 block text-xs text-rose-600">
                        Required
                      </small>
                    )}
                  </label>
                  <label className="block sm:col-span-2 xl:col-span-1">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      Remarks
                    </span>
                    <input
                      value={item.remarks}
                      onChange={(e) =>
                        updateItem(item.id, "remarks", e.target.value)
                      }
                      placeholder="Optional note"
                      className={inputClass()}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
          >
            <Plus size={16} /> Add another material item
          </button>
        </div>
      </section>
      <div className="sticky bottom-3 z-10 flex flex-col-reverse justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <p className="text-xs text-slate-500">
          <span className="text-rose-500">*</span> Required fields ·{" "}
          {items.length} material {items.length === 1 ? "item" : "items"}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-50"
          >
            <Save size={16} /> Save as draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("submit")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
          >
            <Send size={15} /> Submit for approval
          </button>
        </div>
      </div>
    </div>
  );
}
