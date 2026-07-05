import { Shield, Plus, Lock } from "lucide-react";

function Header({ activePage, onAddClick, isPinRequired, lockVault }) {
  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard Overview";
      case "documents":
        return "Documents Locker";
      case "settings":
        return "Vault Settings";
      default:
        return "Card Vault";
    }
  };

  const getPageSubtitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Monitor card stats, security scores, and category distribution.";
      case "documents":
        return "Manage, search, view details, and export secure PDF copies.";
      case "settings":
        return "Configure simulated security codes, import/export backups, and reset storage.";
      default:
        return "Secure Offline Document Safe.";
    }
  };

  return (
    <header className="header">
      <div className="header-title-section">
        <h2>{getPageTitle()}</h2>
        <p>{getPageSubtitle()}</p>
      </div>

      <div className="header-actions">
        {/* Quick Lock Button if PIN is active */}
        {isPinRequired && (
          <button
            className="btn-secondary"
            onClick={lockVault}
            title="Lock Vault Immediately"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Lock size={14} />
            <span>Lock Safe</span>
          </button>
        )}

        <div className="status-badge">
          <Shield size={14} />
          <span>Local Safe Only</span>
        </div>

        {activePage === "documents" && (
          <button className="btn-primary" onClick={onAddClick}>
            <Plus size={16} />
            <span>Add Document</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;