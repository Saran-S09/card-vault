import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import AddCardModal from "../components/AddCardModal";
import CardGrid from "../components/CardGrid";
import EmptyState from "../components/EmptyState";
import DocumentModal from "../components/DocumentModal";
import PinLock from "../components/PinLock";

import useLocalStorage from "../hooks/useLocalStorage";
import { DEFAULT_CARDS, CATEGORIES } from "../utils/constants";
import { Database, Key, Trash2, LayoutDashboard, FileText } from "lucide-react";

function Dashboard() {
  // Document cards state initialized with default high-fidelity cards
  const [cards, setCards] = useLocalStorage("cardVault", DEFAULT_CARDS);
  
  // Navigation active page
  const [activePage, setActivePage] = useState("dashboard");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | alphabetical

  // Modal control states
  const [selectedCard, setSelectedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // Security & Passcode state
  const [vaultPin, setVaultPin] = useLocalStorage("cardVaultPin", "");
  const [isPinRequired, setIsPinRequired] = useLocalStorage("cardVaultPinRequired", false);
  const [showPinSetupModal, setShowPinSetupModal] = useState(false);
  
  // Initialize lock state immediately on mount to prevent flash of content
  const [isLocked, setIsLocked] = useState(() => {
    try {
      const pin = localStorage.getItem("cardVaultPin");
      const pinReq = localStorage.getItem("cardVaultPinRequired");
      
      const hasPin = pin ? JSON.parse(pin) : "";
      const isReq = pinReq ? JSON.parse(pinReq) : false;
      
      return !!(isReq && hasPin);
    } catch (e) {
      console.error("Error reading initial lock state:", e);
      return false;
    }
  });

  // Card operation functions
  const addCard = (card) => {
    setCards([card, ...cards]);
    setIsAddCardOpen(false);
  };

  const updateCard = (updatedCard) => {
    setCards(
      cards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    setEditingCard(null);
  };

  const deleteCard = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this document?")) {
      setCards(cards.filter((card) => card.id !== id));
      if (selectedCard && selectedCard.id === id) {
        setSelectedCard(null);
      }
    }
  };

  // PIN settings toggles
  const handlePinToggle = () => {
    if (isPinRequired) {
      // Disabling PIN
      setIsPinRequired(false);
      setVaultPin("");
    } else {
      // Enabling PIN: Trigger PIN Lock setup view
      setShowPinSetupModal(true);
    }
  };

  const setupNewPin = (pinValue) => {
    setVaultPin(pinValue);
    setIsPinRequired(true);
    setShowPinSetupModal(false);
  };

  // Backup & Restore
  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      cards,
      isPinRequired,
      vaultPin
    }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `card_vault_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.cards)) {
          setCards(parsed.cards);
          if (parsed.vaultPin) {
            setVaultPin(parsed.vaultPin);
            setIsPinRequired(!!parsed.isPinRequired);
          }
          alert("Backup restored successfully! Total cards loaded: " + parsed.cards.length);
        } else {
          alert("Invalid backup file format: Missing 'cards' array.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse JSON backup file.");
      }
    };
    fileReader.readAsText(file);
    e.target.value = ""; // Clear input file selection
  };

  const clearAllData = () => {
    if (window.confirm("CRITICAL WARNING: This will permanently wipe all cards, passcodes, and settings from local storage. Are you absolutely sure?")) {
      setCards([]);
      setVaultPin("");
      setIsPinRequired(false);
      setIsLocked(false);
      alert("Vault data cleared successfully.");
    }
  };

  // Filter and Sort Cards
  const getFilteredAndSortedCards = () => {
    let result = cards;

    // Search query matching
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.number.toLowerCase().includes(query) ||
          (card.notes && card.notes.toLowerCase().includes(query))
      );
    }

    // Category matching
    if (selectedCategory !== "all") {
      result = result.filter((card) => card.category === selectedCategory);
    }

    // Sorting options
    return [...result].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "oldest") {
        return a.id - b.id; // Lower id = older timestamp
      } else {
        return b.id - a.id; // Higher id = newer timestamp
      }
    });
  };

  const filteredCards = getFilteredAndSortedCards();

  // Statistics Calculations
  const totalDocs = cards.length;
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cards.filter((c) => c.category === cat.id).length;
    return acc;
  }, {});

  // Safety Score calculation (out of 100)
  const calculateSafetyScore = () => {
    let score = 0;
    if (isPinRequired && vaultPin) score += 40; // PIN setup is main security
    if (totalDocs > 0) score += 20; // Active locker use
    
    // Check if cards have descriptions/notes for security reasons
    const cardsWithNotes = cards.filter(c => c.notes && c.notes.length > 10).length;
    if (totalDocs > 0 && cardsWithNotes === totalDocs) score += 20;
    else if (totalDocs > 0 && cardsWithNotes > 0) score += 10;
    
    // Check if numbers are sufficiently detailed (contains some length)
    const longNumbers = cards.filter(c => c.number && c.number.length >= 8).length;
    if (totalDocs > 0 && longNumbers === totalDocs) score += 20;

    return totalDocs === 0 && !isPinRequired ? 30 : score;
  };

  const safetyScore = calculateSafetyScore();

  // Handle Edit Card modal pop
  const handleStartEdit = (card) => {
    setEditingCard(card);
    setIsAddCardOpen(true);
  };

  return (
    <div className="layout">
      {/* Locked Screen Overlay */}
      {isLocked && isPinRequired && vaultPin && (
        <PinLock
          correctPin={vaultPin}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Temp PIN setup lock screen */}
      {showPinSetupModal && (
        <PinLock
          correctPin=""
          onUnlock={() => {}}
          onSetupPin={setupNewPin}
        />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        totalCount={totalDocs}
        isPinActive={isPinRequired && !!vaultPin}
      />

      <main className="content">
        <Header
          activePage={activePage}
          onAddClick={() => {
            setEditingCard(null);
            setIsAddCardOpen(true);
          }}
          isLocked={isLocked}
          isPinRequired={isPinRequired}
          lockVault={() => {
            if (isPinRequired && vaultPin) setIsLocked(true);
          }}
        />

        {/* Dashboard Stat Page */}
        {activePage === "dashboard" && (
          <>
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: "#3b82f6" }}>
                  <FileText size={24} />
                </div>
                <div className="stat-details">
                  <h4>Total Documents</h4>
                  <div className="stat-value">{totalDocs}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: isPinRequired ? "#10b981" : "#f43f5e" }}>
                  <Key size={24} />
                </div>
                <div className="stat-details">
                  <h4>Passcode Security</h4>
                  <div className="stat-value" style={{ fontSize: "16px", color: isPinRequired ? "#10b981" : "#f43f5e", marginTop: "12px", fontWeight: "bold" }}>
                    {isPinRequired ? "SIMULATED LOCK ON" : "UNPROTECTED"}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ color: "#8b5cf6" }}>
                  <Database size={24} />
                </div>
                <div className="stat-details">
                  <h4>Vault Storage</h4>
                  <div className="stat-value" style={{ fontSize: "16px", marginTop: "12px" }}>
                    LOCAL STORAGE
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-details-row">
              <div className="dashboard-panel">
                <h3>
                  <LayoutDashboard size={20} />
                  Category Breakdown
                </h3>
                <div className="category-bar-list">
                  {CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    const percent = totalDocs > 0 ? (count / totalDocs) * 100 : 0;
                    return (
                      <div className="category-bar-item" key={cat.id}>
                        <div className="category-bar-info">
                          <span className="category-bar-name">{cat.name}</span>
                          <span className="category-bar-count">{count} {count === 1 ? "document" : "documents"} ({Math.round(percent)}%)</span>
                        </div>
                        <div className="category-bar-track">
                          <div
                            className="category-bar-fill"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: cat.color,
                              boxShadow: `0 0 8px ${cat.color}`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-panel safety-meter-card">
                <div
                  className="safety-score-circle"
                  style={{
                    borderTopColor: safetyScore > 70 ? "#10b981" : safetyScore > 40 ? "#f59e0b" : "#f43f5e",
                    borderRightColor: safetyScore > 70 ? "#10b981" : safetyScore > 40 ? "#f59e0b" : "#f43f5e"
                  }}
                >
                  <div className="safety-score-value" style={{ color: safetyScore > 70 ? "#10b981" : safetyScore > 40 ? "#f59e0b" : "#f43f5e" }}>
                    {safetyScore}%
                  </div>
                  <div className="safety-score-label">Score</div>
                </div>
                <div className="safety-status-title">
                  {safetyScore > 70 ? "High Security Locker" : safetyScore > 40 ? "Moderate Security" : "Vulnerable Locker"}
                </div>
                <p className="safety-status-desc">
                  {isPinRequired
                    ? "Your vault is protected by a simulated lock. Backups can be taken regularly to preserve details offline."
                    : "Activate simulated PIN lock in Settings to secure your documents and boost safety score."}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Documents Main List Grid View */}
        {activePage === "documents" && (
          <>
            <SearchBar
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {filteredCards.length === 0 ? (
              <EmptyState onAddClick={() => setIsAddCardOpen(true)} />
            ) : (
              <CardGrid
                cards={filteredCards}
                deleteCard={deleteCard}
                setSelectedCard={setSelectedCard}
                setEditingCard={handleStartEdit}
              />
            )}
          </>
        )}

        {/* Settings Configurations Page */}
        {activePage === "settings" && (
          <div className="settings-container">
            <div className="settings-card">
              <h3>
                <Key size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Security Lock Options
              </h3>
              <div className="settings-row">
                <div className="settings-info">
                  <h4>Simulated PIN Protection</h4>
                  <p>Require a 4-digit PIN to lock the dashboard contents when visiting.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isPinRequired}
                    onChange={handlePinToggle}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {isPinRequired && vaultPin && (
                <div className="settings-row">
                  <div className="settings-info">
                    <h4>Reset Passcode PIN</h4>
                    <p>Setup a new 4-digit security code for locking your document vault.</p>
                  </div>
                  <button className="btn-secondary" onClick={() => setShowPinSetupModal(true)}>
                    Change PIN
                  </button>
                </div>
              )}
            </div>

            <div className="settings-card">
              <h3>
                <Database size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Data Portability (Backup & Recovery)
              </h3>
              <div className="settings-row">
                <div className="settings-info">
                  <h4>Export Vault Database</h4>
                  <p>Download a JSON backup containing all cards, documents, and credentials offline.</p>
                </div>
                <button className="btn-primary" onClick={exportBackup}>
                  <Database size={16} /> Export Backup JSON
                </button>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <h4>Import Vault Database</h4>
                  <p>Upload a previously exported JSON vault backup file to restore records.</p>
                </div>
                <label className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <Database size={16} /> Load Backup File
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={importBackup}
                  />
                </label>
              </div>
            </div>

            <div className="settings-card" style={{ borderColor: "rgba(244, 63, 94, 0.2)" }}>
              <h3 style={{ color: "var(--accent-rose)" }}>
                <Trash2 size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
                Danger Zone
              </h3>
              <div className="settings-row">
                <div className="settings-info">
                  <h4>Purge Entire Vault</h4>
                  <p>Permanently remove all credentials, passwords, images, and keys from this browser.</p>
                </div>
                <button className="btn-danger" onClick={clearAllData}>
                  <Trash2 size={16} /> Wipe All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sliding Add & Edit Form Modal overlay */}
      {isAddCardOpen && (
        <AddCardModal
          key={editingCard ? `edit-${editingCard.id}` : "add-new"}
          addCard={addCard}
          editingCard={editingCard}
          updateCard={updateCard}
          onClose={() => {
            setIsAddCardOpen(false);
            setEditingCard(null);
          }}
        />
      )}

      {/* Large Document Magnifier Viewer Modal */}
      <DocumentModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onEdit={(card) => {
          setSelectedCard(null);
          handleStartEdit(card);
        }}
        onDelete={(id) => deleteCard(id)}
      />
    </div>
  );
}

export default Dashboard;