import { FolderOpen, Plus } from "lucide-react";

function EmptyState({ onAddClick }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FolderOpen size={36} />
      </div>
      <h3>No Documents Stored</h3>
      <p>
        Your digital locker is empty. Start securing your identity cards, financial papers, and certificates locally.
      </p>
      <button className="btn-primary" onClick={onAddClick}>
        <Plus size={16} />
        <span>Add Your First Card</span>
      </button>
    </div>
  );
}

export default EmptyState;