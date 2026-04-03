import React, { useState, useEffect } from 'react';

interface DecimalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (val: number) => void;
}

const DecimalInput: React.FC<DecimalInputProps> = ({ value, onChange, ...props }) => {
  const [displayValue, setDisplayValue] = useState(value.toString());

  useEffect(() => {
    // Only update display value if the parsed number is different
    // This allows the user to type a trailing dot without it disappearing
    if (parseFloat(displayValue) !== value) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow empty string, numbers, and a single decimal point
    // We use a regex that matches valid partial decimal numbers
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      setDisplayValue(val);
      
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        onChange(parsed);
      } else if (val === '' || val === '-') {
        onChange(0);
      }
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
    />
  );
};

export default DecimalInput;
