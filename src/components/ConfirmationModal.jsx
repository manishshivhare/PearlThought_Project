import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, eventDate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-md p-6 w-80">
        <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
        <p>Are you sure you want to remove the reminder for event on {eventDate}?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
