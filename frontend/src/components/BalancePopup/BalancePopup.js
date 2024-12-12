import React, { useEffect, useRef } from 'react';
import './BalancePopup.css';

const BalancePopup = ({ balance, isVisible, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="balance-popup" ref={popupRef}>
      <div className="balance-content">
        <h3>Ваш баланс</h3>
        <div className="balance-amount">{balance} ₽</div>
      </div>
    </div>
  );
};

export default BalancePopup; 