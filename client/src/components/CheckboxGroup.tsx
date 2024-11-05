import React, { createContext, useContext } from 'react';

// Context for checkbox group
interface CheckboxGroupContextType {
  selectedValues: string[];
  toggleValue: (value: string) => void;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextType | undefined>(undefined);

// Props for individual checkbox
interface CheckboxProps {
  value: string;
  children: React.ReactNode;
}

// Props for checkbox group
interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: React.ReactNode;
  label?: string;
}

// Individual Checkbox Component
const Checkbox: React.FC<CheckboxProps> = ({ value, children }) => {
  const context = useContext(CheckboxGroupContext);
  if (!context) throw new Error('Checkbox must be used within a CheckboxGroup');

  const isSelected = context.selectedValues.includes(value);

  return (
    <button
      type="button"
      onClick={() => context.toggleValue(value)}
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200 ease-in-out
        ${isSelected
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
      role="checkbox"
      aria-checked={isSelected}
    >
      {children}
    </button>
  );
};

// Checkbox Group Component
export const CheckboxGroup: React.FC<CheckboxGroupProps> & { Checkbox: typeof Checkbox } = ({
  value,
  onValueChange,
  children,
  label
}) => {
  const toggleValue = (clickedValue: string) => {
    const newValues = value.includes(clickedValue)
      ? value.filter(v => v !== clickedValue)
      : [...value, clickedValue];
    onValueChange(newValues);
  };

  return (
    <CheckboxGroupContext.Provider value={{ selectedValues: value, toggleValue }}>
      {label && (
        <p className="text-sm font-semibold mb-1">{label}</p>
      )}
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
};

// Attach Checkbox component to CheckboxGroup
CheckboxGroup.Checkbox = Checkbox;
