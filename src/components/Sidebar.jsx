import { LayoutDashboard, FileText, Settings, ShieldCheck } from "lucide-react";

function Sidebar({ activePage, setActivePage, totalCount, isPinActive }) {
  // Let's assume a simulated local vault capacity limit of 50 documents
  const capacityLimit = 50;
  const capacityPercent = Math.min((totalCount / capacityLimit) * 100, 100);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ShieldCheck size={28} />
        <h1>Card Vault</h1>
      </div>

      <ul className="sidebar-menu">
        <li
          className={`sidebar-item ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </li>

        <li
          className={`sidebar-item ${activePage === "documents" ? "active" : ""}`}
          onClick={() => setActivePage("documents")}
        >
          <FileText />
          <span>Documents</span>
        </li>

        <li
          className={`sidebar-item ${activePage === "settings" ? "active" : ""}`}
          onClick={() => setActivePage("settings")}
        >
          <Settings />
          <span>Settings</span>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span
            className="sidebar-status-dot"
            style={{
              backgroundColor: isPinActive ? "var(--accent-emerald)" : "var(--accent-rose)",
              boxShadow: isPinActive ? "0 0 8px var(--accent-emerald)" : "0 0 8px var(--accent-rose)"
            }}
          />
          <span>{isPinActive ? "PIN Protect ON" : "Unprotected"}</span>
        </div>
        
        <div className="sidebar-capacity">
          <div style={{ display: "flex", justifyContent: "between", width: "100%" }}>
            <span>Locker Capacity</span>
            <span style={{ float: "right" }}>{totalCount}/{capacityLimit}</span>
          </div>
          <div className="sidebar-bar-bg">
            <div
              className="sidebar-bar-fill"
              style={{
                width: `${capacityPercent}%`,
                background: capacityPercent > 80 ? "var(--accent-rose)" : "linear-gradient(90deg, var(--accent-indigo), var(--accent-blue))"
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;