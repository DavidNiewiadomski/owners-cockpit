import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './DateInput.css';

interface DateInputProps {
  value?: string | Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  label,
  className = "",
  required = false,
  disabled = false,
  onFocus,
  onBlur
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert value to Date if it's a string, and format for display
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const parsed = parseISO(value);
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  }, [value]);

  // Update input value when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setInputValue(format(selectedDate, 'MMM dd, yyyy'));
    } else {
      setInputValue('');
    }
  }, [selectedDate]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      onFocus?.();
    }
  };

  const handleInputBlur = () => {
    // Don't close immediately to allow calendar interaction
    setTimeout(() => {
      onBlur?.();
    }, 100);
  };

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Try to parse the input as a date
    if (newValue) {
      const parsed = new Date(newValue);
      if (isValid(parsed)) {
        onChange(parsed);
      }
    } else {
      onChange(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInputClick();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          onFocus={handleInputClick}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border border-input rounded-md shadow-sm bg-background text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-input
            ${disabled ? 'bg-muted cursor-not-allowed' : 'cursor-pointer hover:border-accent'}
            ${className}
          `}
          readOnly={false}
        />
        
        {/* Calendar Icon */}
        <div 
          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleInputClick}
        >
          <svg 
            className="h-5 w-5 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>

      {/* Date Picker Popup */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden date-picker-container">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="p-3"
            showOutsideDays
            fixedWeeks
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-foreground",
              nav: "space-x-1 flex items-center",
              nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 w-7",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "inline-flex items-center justify-center rounded-md text-sm font-normal ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 h-9 w-9 p-0 font-normal text-foreground hover:bg-accent hover:text-accent-foreground",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground font-semibold",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
