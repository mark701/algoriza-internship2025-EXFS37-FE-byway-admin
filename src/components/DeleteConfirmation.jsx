import  { useState } from 'react';

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, name }) {

  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen) return null;
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(); 
    } finally {
      setIsDeleting(false); 
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4  transition-colors"
        >
          <img src={`${process.env.PUBLIC_URL}/Assets/Icons/cross.png`} alt="close" className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <img
              src={`${process.env.PUBLIC_URL}/Assets/Icons/deleteConfirm.png`}
              alt="deleteConfirm"
              className="w-8 h-8"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 ">
            Are you sure you want to delete
          </p>
          <p className="text-gray-600 ">

            <span className="font-semibold text-gray-800">{name}</span> ?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 text-gray-600 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 px-4 text-white bg-red-500 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}