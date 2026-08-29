import React from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
}

const inputClasses =
  'w-full px-3 py-3 bg-white border-2 border-gray-400 md:border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-gray-500 sm:placeholder-gray-400';

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  icon,
  helpText,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon && <span className="inline mr-1">{icon}</span>}
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
        placeholder={placeholder}
      />
      {helpText && <p className="text-xs text-gray-600 sm:text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
}
