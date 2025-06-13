import React, { useEffect } from "react";
import "./ComingSoonModal.scss";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Bientôt disponible</h2>
        <p>Le distributeur sera bientôt disponible. Restez à l'écoute !</p>
        <button className="modal-confirm-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;
