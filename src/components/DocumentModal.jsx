import { useState } from "react";
import { X, Copy, Check, Pencil, Download, Trash2 } from "lucide-react";
import { downloadPdf } from "../utils/downloadPdf";
import { CATEGORIES } from "../utils/constants";

function DocumentModal({ card, onClose, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");

  if (!card) return null;

  // Find category meta
  const categoryMeta = CATEGORIES.find((cat) => cat.id === card.category) || {
    name: "Other",
    color: "#6b7280"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(card.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Magnifier zoom coordination
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container viewer-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Digital Document Viewer</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="viewer-grid">
          {/* Left Side: Zoomable Preview Image */}
          <div className="viewer-image-pane">
            <div
              className="viewer-image-container"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => {
                setIsZoomed(false);
                setZoomOrigin("center center");
              }}
              onMouseMove={handleMouseMove}
            >
              <img
                src={card.image}
                alt={card.title}
                style={{
                  transform: isZoomed ? "scale(2.2)" : "scale(1)",
                  transformOrigin: zoomOrigin
                }}
              />
              <div className="viewer-zoom-controls">
                Hover card to magnify text
              </div>
            </div>
          </div>

          {/* Right Side: Document Metadata Info */}
          <div className="viewer-info-pane">
            <div className="viewer-header-info">
              <div className="viewer-title-row">
                <h2>{card.title}</h2>
                <span
                  className="card-category-badge"
                  style={{
                    backgroundColor: categoryMeta.color,
                    position: "relative",
                    top: 0,
                    left: 0
                  }}
                >
                  {categoryMeta.name}
                </span>
              </div>
              
              <table className="viewer-meta-table">
                <tbody>
                  <tr>
                    <td className="viewer-meta-label">Category</td>
                    <td className="viewer-meta-val">{categoryMeta.name}</td>
                  </tr>
                  <tr>
                    <td className="viewer-meta-label">Doc Number</td>
                    <td className="viewer-meta-val">
                      <div className="copy-row">
                        <span style={{ fontFamily: "monospace", letterSpacing: "1px", fontSize: "14px" }}>
                          {card.number}
                        </span>
                        <button className="card-icon-btn" onClick={handleCopy} title="Copy Number">
                          {copied ? (
                            <Check size={14} style={{ color: "var(--accent-emerald)" }} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="viewer-meta-label">Added On</td>
                    <td className="viewer-meta-val">{card.createdAt || new Date().toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td className="viewer-meta-label">Expiry Date</td>
                    <td className={`viewer-meta-val ${card.expiryDate && new Date(card.expiryDate) < new Date() ? "pin-error-msg" : ""}`}>
                      {card.expiryDate ? (
                        <span>
                          {new Date(card.expiryDate).toLocaleDateString()}
                          {new Date(card.expiryDate) < new Date() && " (EXPIRED)"}
                        </span>
                      ) : (
                        "No Expiry / Lifetime"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Description / Remarks notes box */}
              <div className="viewer-notes">
                <h4>Vault Notes / Remarks</h4>
                <p>{card.notes || "No secure remarks added to this document copy."}</p>
              </div>
            </div>

            {/* Document Action Drawer */}
            <div className="viewer-actions">
              <button className="btn-primary" onClick={() => downloadPdf(card)}>
                <Download size={16} /> Export PDF
              </button>

              <button className="btn-secondary" onClick={() => onEdit(card)}>
                <Pencil size={16} /> Edit
              </button>

              <button
                className="btn-danger"
                onClick={() => {
                  onDelete(card.id);
                }}
                style={{ flex: "0.8" }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentModal;