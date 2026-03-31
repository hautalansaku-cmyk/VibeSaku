import { AlertTriangle, X } from 'lucide-react';
import type { Book } from '../types';

interface Props {
  book: Book;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function DeleteDialog({ book, onConfirm, onClose }: Props) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100 bg-red-50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <span className="font-semibold text-sm">Remove Book</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-gray-700 text-sm">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-gray-900">"{book.name}"</span>{' '}
            from inventory?
          </p>
          <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
