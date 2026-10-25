import {
  ClipboardList,
  PackageCheck,
  Plus,
  ChevronDown,
  Bell,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f8fa] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[78px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <PackageCheck size={22} />
          </div>
          <div>
            <div className="font-bold tracking-tight text-slate-900">
              ProcureFlow
            </div>
            <div className="text-[11px] text-slate-400">MANUFACTURING ERP</div>
          </div>
        </div>
        <div className="px-4 pt-7">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">
            Workspace
          </div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50"}`
            }
          >
            <ClipboardList size={18} /> Purchase requisitions
          </NavLink>
          <NavLink
            to="/new"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-brand-50 text-brand-700" : "text-slate-500 hover:bg-slate-50"}`
            }
          >
            <Plus size={18} /> Create requisition
          </NavLink>
        </div>
        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">Jordan Davis</div>
              <div className="text-xs text-slate-400">Procurement admin</div>
            </div>
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-10 flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur md:px-9">
          <div>
            <div className="text-xs text-slate-400">
              Workspace / <span className="text-slate-600">Purchasing</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-800">
              Purchase requisition management
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold">Jordan Davis</div>
              <div className="text-xs text-slate-400">Operations</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              JD
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 md:p-9">
          <Outlet />
        </main>
        <footer className="px-5 pb-6 text-center text-xs text-slate-400 md:px-9">
          ProcureFlow · Purchase requisitions · Assessment demo
        </footer>
      </div>
    </div>
  );
}
