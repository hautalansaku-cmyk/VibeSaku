import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export default function QuantityControl({ value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 text-gray-500 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Decrease quantity"
      >
        <Minus size={12} />
      </button>

      <span
        className={`w-10 text-center text-sm font-semibold tabular-nums ${
          value === 0
            ? 'text-red-500'
            : value <= 10
            ? 'text-amber-600'
            : 'text-gray-800'
        }`}
      >
        {value}
      </span>

      <button
        onClick={() => onChange(value + 1)}
        disabled={disabled}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 text-gray-500 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Increase quantity"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
