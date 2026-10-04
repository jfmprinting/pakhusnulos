import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.type === 'error' ? (
            <AlertCircle size={16} color="#EF4444" />
          ) : toast.type === 'info' ? (
            <Info size={16} color="#3B82F6" />
          ) : (
            <CheckCircle2 size={16} color="#10B981" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
