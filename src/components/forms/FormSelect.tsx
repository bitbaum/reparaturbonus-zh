import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Bitte wählen',
  required = false,
  icon,
  helpText,
}: FormSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="inline mr-1">{icon}</span>}
        {label}
        {required && ' *'}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-3 pr-10 bg-white border-2 border-gray-400 md:border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer transition-colors"
          style={{
            color: value ? '#111827' : '#6B7280',
          }}
        >
          <option value="" disabled style={{ color: '#6B7280' }}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ color: '#111827' }}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {helpText && <p className="text-xs text-gray-600 sm:text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
