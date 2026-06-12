import React from 'react';
import { toast } from 'react-toastify';

export const confirmToast = (message: string, onConfirm: () => void) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="text-sm font-medium mb-3 text-gray-800">{message}</p>
        <div className="flex justify-end gap-2">
          <button 
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={closeToast}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={() => {
              onConfirm();
              if (closeToast) closeToast();
            }}
          >
            OK
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      icon: false,
      position: 'top-center',
    }
  );
};
