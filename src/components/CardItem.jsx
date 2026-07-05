import { useState } from "react";
import { Eye, EyeOff, Copy, Check, ExternalLink, Pencil, Download, Trash2 } from "lucide-react";
import { downloadPdf } from "../utils/downloadPdf";
import { CATEGORIES } from "../utils/constants";

function CardItem({ card, deleteCard, setSelectedCard, setEditingCard }) {
  const [isMasked, setIsMasked] = useState(true);
  const [copied, setCopied] = useState(false);

  // Find category styling
  const categoryMeta = CATEGORIES.find((cat) => cat.id === card.category) || {
    name: "Other",
    color: "#6b7280",
    bgLight: "rgba(107, 114, 128, 0.1)"
  };

  // Helper to mask card number
  const formatCardNumber = (num, mask) => {
    if (!num) return "";
    if (!mask) return num;

    const cleaned = num.replace(/\s+/g, "");
    if (cleaned.length <= 4) return num;

    // Mask all but last 4 characters
    const visiblePart = cleaned.slice(-4);
    const maskedPart = "•".repeat(cleaned.length - 4);
    const combined = maskedPart + visiblePart;

    // Add spaces for readability if it resembles standard Aadhaar/Bank spacing (e.g. groups of 4)
    if (cleaned.length === 12) {
      // Aadhaar Card
      return `${combined.slice(0, 4)} ${combined.slice(4, 8)} ${combined.slice(8)}`;
    }
    return combined;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(card.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate glowing hover colors
  const glowStyle = {
    "--border-hover-color": categoryMeta.color,
    "--glow-color": `${categoryMeta.color}1e` // Adds 12% opacity in hex (1e) for subtle glow
  };

  return (
    <div className="document-card" style={glowStyle}>
      <div className="card-image-wrapper" onClick={() => setSelectedCard(card)} style={{ cursor: "pointer" }}>
        <img src={card.image} alt={card.title} loading="lazy" />
        <span
          className="card-category-badge"
          style={{ backgroundColor: categoryMeta.color }}
        >
          {categoryMeta.name}
        </span>
      </div>

      <div className="card-content">
        <h3 title={card.title} onClick={() => setSelectedCard(card)} style={{ cursor: "pointer" }}>
          {card.title}
        </h3>

        <div className="card-number-row">
          <span className="card-number">
            {formatCardNumber(card.number, isMasked)}
          </span>
          
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              className="card-icon-btn"
              onClick={() => setIsMasked(!isMasked)}
              title={isMasked ? "Show Number" : "Hide Number"}
            >
              {isMasked ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            
            <button
              className="card-icon-btn"
              onClick={handleCopy}
              title="Copy Number"
            >
              {copied ? <Check size={16} style={{ color: "var(--accent-emerald)" }} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="card-meta">
          <span>Added: {card.createdAt || new Date().toLocaleDateString()}</span>
          {card.expiryDate && (
            <span style={{ color: new Date(card.expiryDate) < new Date() ? "var(--accent-rose)" : "inherit" }}>
              Expires: {new Date(card.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="card-actions-tray">
          <button
            className="card-btn"
            onClick={() => setSelectedCard(card)}
            title="Open Fullscreen Document"
          >
            <ExternalLink />
            <span>Open</span>
          </button>
          
          <button
            className="card-btn"
            onClick={() => setEditingCard(card)}
            title="Edit Details"
          >
            <Pencil />
            <span>Edit</span>
          </button>

          <button
            className="card-btn"
            onClick={() => downloadPdf(card)}
            title="Download PDF Copy"
          >
            <Download />
            <span>PDF</span>
          </button>
          
          <button
            className="card-btn btn-delete"
            onClick={() => deleteCard(card.id)}
            title="Delete Permanently"
          >
            <Trash2 />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardItem;