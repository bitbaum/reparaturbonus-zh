import React from 'react';

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  helpText?: string;
}

const textareaClasses =
  'w-full px-3 py-3 bg-white border-2 border-gray-400 md:border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-gray-500 sm:placeholder-gray-400';

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  helpText,
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && ' *'}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={textareaClasses}
        placeholder={placeholder}
      />
      {helpText && <p className="text-xs text-gray-600 sm:text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
