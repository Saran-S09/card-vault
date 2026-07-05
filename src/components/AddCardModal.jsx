import { useRef, useState } from "react";
import { X, Upload, ShieldAlert } from "lucide-react";
import { fileToBase64 } from "../utils/fileToBase64";
import { CATEGORIES } from "../utils/constants";

function AddCardModal({ addCard, editingCard, updateCard, onClose }) {
  const [title, setTitle] = useState(editingCard ? editingCard.title || "" : "");
  const [number, setNumber] = useState(editingCard ? editingCard.number || "" : "");
  const [category, setCategory] = useState(editingCard ? editingCard.category || "identity" : "identity");
  const [notes, setNotes] = useState(editingCard ? editingCard.notes || "" : "");
  const [expiryDate, setExpiryDate] = useState(editingCard ? editingCard.expiryDate || "" : "");
  const [image, setImage] = useState(editingCard ? editingCard.image || "" : "");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const fileRef = useRef(null);

  const currentCatMeta = CATEGORIES.find((cat) => cat.id === category) || CATEGORIES[0];

  // Preset Title helpers based on category
  const getPresets = () => {
    switch (category) {
      case "identity":
        return ["Aadhaar Card", "Passport", "Driver's License", "Voter ID"];
      case "financial":
        return ["PAN Card", "Credit Card", "Debit Card", "Bank Passbook"];
      case "education":
        return ["Degree Certificate", "10th Marksheet", "12th Marksheet"];
      case "health":
        return ["Health Insurance Card", "Vaccination Certificate"];
      case "work":
        return ["Employee ID", "Offer Letter", "Salary Slip"];
      default:
        return [];
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are supported" }));
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImage(base64);
      setErrors((prev) => ({ ...prev, image: null }));
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, image: "Failed to read image file" }));
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Document Title is required";
    if (!number.trim()) newErrors.number = "Document Number is required";
    if (!image) newErrors.image = "Document Image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const documentData = {
      title: title.trim(),
      number: number.trim(),
      category,
      notes: notes.trim(),
      expiryDate,
      image,
      createdAt: editingCard?.createdAt || new Date().toLocaleDateString()
    };

    if (editingCard) {
      updateCard({
        ...editingCard,
        ...documentData
      });
    } else {
      addCard({
        id: Date.now(),
        ...documentData
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingCard ? "Edit Document" : "Secure New Document"}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            {/* Category Dropdown */}
            <div className="form-group">
              <label>Document Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Clear title preset if not matching
                  setTitle("");
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Title */}
            <div className="form-group">
              <label>Document Title</label>
              <input
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder={currentCatMeta.placeholder}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                style={errors.title ? { borderColor: "var(--accent-rose)" } : {}}
              />
              {errors.title && (
                <span style={{ color: "var(--accent-rose)", fontSize: "11px", marginTop: "4px" }}>
                  {errors.title}
                </span>
              )}

              {/* Presets Badges */}
              {getPresets().length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {getPresets().map((preset) => (
                    <span
                      key={preset}
                      onClick={() => {
                        setTitle(preset);
                        if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                      }}
                      style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        background: title === preset ? currentCatMeta.color : "rgba(255, 255, 255, 0.03)",
                        border: `1px solid ${title === preset ? currentCatMeta.color : "var(--border-color)"}`,
                        color: title === preset ? "#fff" : "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {preset}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Number & Expiry Date Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Document Number / Code</label>
                <input
                  className={`form-input ${errors.number ? "error" : ""}`}
                  placeholder={currentCatMeta.numberPlaceholder}
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                    if (errors.number) setErrors((prev) => ({ ...prev, number: null }));
                  }}
                  style={errors.number ? { borderColor: "var(--accent-rose)" } : {}}
                />
                {errors.number && (
                  <span style={{ color: "var(--accent-rose)", fontSize: "11px", marginTop: "4px" }}>
                    {errors.number}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="form-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            {/* Notes / Secret Codes */}
            <div className="form-group">
              <label>Additional Notes / Secure Remarks (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Enter document details, PIN codes, renewal remarks, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Image File Upload System */}
            <div className="form-group">
              <label>Document Card Image Copy</label>
              
              {!image ? (
                <div
                  className={`upload-drop-zone ${dragActive ? "active" : ""}`}
                  onDragEnter={onDrag}
                  onDragOver={onDrag}
                  onDragLeave={onDrag}
                  onDrop={onDrop}
                  onClick={() => fileRef.current && fileRef.current.click()}
                  style={errors.image ? { borderColor: "var(--accent-rose)" } : {}}
                >
                  <Upload size={32} />
                  <span className="upload-label">Drag & drop document image or <span style={{ color: "var(--accent-blue)" }}>browse</span></span>
                  <span className="upload-hint">Supports JPEG, PNG, WEBP (Max 2MB)</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="upload-preview-container">
                  <img src={image} className="upload-preview-image" alt="Uploaded Document Preview" />
                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={() => setImage("")}
                  >
                    Replace Image
                  </button>
                </div>
              )}
              
              {errors.image && (
                <span style={{ color: "var(--accent-rose)", fontSize: "11px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldAlert size={12} />
                  {errors.image}
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCard ? "Update Details" : "Lock in Vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCardModal;