export type PRStatus = "Draft" | "Pending Approval" | "Approved" | "Rejected";
export type Priority = "Low" | "Medium" | "High";
export interface MaterialItem {
  id: string;
  materialCode: string;
  materialName: string;
  quantity: number | "";
  requiredDate: string;
  remarks: string;
}
export interface Requisition {
  id: string;
  prNumber: string;
  requestDate: string;
  department: string;
  requestedBy: string;
  priority: Priority;
  status: PRStatus;
  items: MaterialItem[];
  createdAt: string;
}
export interface RequisitionFormValues {
  requestDate: string;
  department: string;
  requestedBy: string;
  priority: Priority;
  items: MaterialItem[];
}
