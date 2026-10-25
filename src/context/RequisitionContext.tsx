import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Requisition, RequisitionFormValues, PRStatus } from "../types";

const STORAGE_KEY = "procureflow-requisitions-v1";
const today = new Date().toISOString().slice(0, 10);
const seed: Requisition[] = [
  {
    id: "seed-1",
    prNumber: "PR-0001",
    requestDate: "2025-09-25",
    department: "Production",
    requestedBy: "John Doe",
    priority: "High",
    status: "Draft",
    createdAt: "2025-09-25T09:00:00.000Z",
    items: [
      {
        id: "m-1",
        materialCode: "MAT-001",
        materialName: "Bearing",
        quantity: 5,
        requiredDate: "2025-09-30",
        remarks: "For production",
      },
      {
        id: "m-2",
        materialCode: "MAT-002",
        materialName: "Steel Sheet",
        quantity: 10,
        requiredDate: "2025-10-02",
        remarks: "",
      },
    ],
  },
  {
    id: "seed-2",
    prNumber: "PR-0002",
    requestDate: today,
    department: "Maintenance",
    requestedBy: "Priya Sharma",
    priority: "Medium",
    status: "Pending Approval",
    createdAt: "2025-10-01T09:00:00.000Z",
    items: [
      {
        id: "m-3",
        materialCode: "MAT-003",
        materialName: "Lubricant",
        quantity: 3,
        requiredDate: today,
        remarks: "Machine maintenance",
      },
    ],
  },
  {
    id: "seed-3",
    prNumber: "PR-0003",
    requestDate: today,
    department: "Procurement",
    requestedBy: "Alex Morgan",
    priority: "Low",
    status: "Approved",
    createdAt: "2025-10-02T09:00:00.000Z",
    items: [
      {
        id: "m-4",
        materialCode: "MAT-004",
        materialName: "Safety Gloves",
        quantity: 20,
        requiredDate: today,
        remarks: "",
      },
      {
        id: "m-5",
        materialCode: "MAT-005",
        materialName: "Safety Glasses",
        quantity: 20,
        requiredDate: today,
        remarks: "",
      },
    ],
  },
];
interface ContextValue {
  requisitions: Requisition[];
  nextPRNumber: string;
  saveRequisition: (
    values: RequisitionFormValues,
    action: "draft" | "submit",
  ) => Requisition;
  updateRequisition: (
    id: string,
    values: RequisitionFormValues,
    action: "draft" | "submit",
  ) => Requisition;
}
const RequisitionContext = createContext<ContextValue | undefined>(undefined);
export function RequisitionProvider({ children }: { children: ReactNode }) {
  const [requisitions, setRequisitions] = useState<Requisition[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Requisition[]) : seed;
    } catch {
      return seed;
    }
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requisitions));
  }, [requisitions]);
  const nextPRNumber = useMemo(
    () =>
      `PR-${String(Math.max(0, ...requisitions.map((r) => Number(r.prNumber.replace("PR-", "")) || 0)) + 1).padStart(4, "0")}`,
    [requisitions],
  );
  function saveRequisition(
    values: RequisitionFormValues,
    action: "draft" | "submit",
  ) {
    const created: Requisition = {
      ...values,
      id: crypto.randomUUID(),
      prNumber: nextPRNumber,
      status: (action === "draft" ? "Draft" : "Pending Approval") as PRStatus,
      createdAt: new Date().toISOString(),
    };
    setRequisitions((current) => [created, ...current]);
    return created;
  }
  function updateRequisition(
    id: string,
    values: RequisitionFormValues,
    action: "draft" | "submit",
  ) {
    const existing = requisitions.find((r) => r.id === id);
    if (!existing) throw new Error("Requisition not found");
    const updated: Requisition = {
      ...existing,
      ...values,
      id: existing.id,
      prNumber: existing.prNumber,
      status: (action === "draft" ? "Draft" : "Pending Approval") as PRStatus,
    };
    setRequisitions((current) =>
      current.map((r) => (r.id === id ? updated : r)),
    );
    return updated;
  }
  return (
    <RequisitionContext.Provider
      value={{ requisitions, nextPRNumber, saveRequisition, updateRequisition }}
    >
      {children}
    </RequisitionContext.Provider>
  );
}
export function useRequisitions() {
  const value = useContext(RequisitionContext);
  if (!value)
    throw new Error("useRequisitions must be used within RequisitionProvider");
  return value;
}
