import React from 'react';
import '../styles/components/Modal.css';

const Modal = ({  
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'confirm', // 'confirm', 'delete', 'success', 'error'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  icon = null,
  children
}) => {
  if (!isOpen) return null;

  const getIconEmoji = () => {
    if (icon) return icon;
    switch (type) {
      case 'delete': return '🗑️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-container modal-${type}`}>
        <div className="modal-header">
          <div className="modal-icon">
            {getIconEmoji()}
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{title}</h2>
          {message && <p className="modal-message">{message}</p>}
          {children}
        </div>

        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`modal-btn modal-btn-confirm modal-btn-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
