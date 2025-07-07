import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selected, onSelect }) => {
  // Handles the date selection
  const handleDayClick = (day: Date) => {
    onSelect(day);
  };

  return (
    <div>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleDayClick}
        footer={
          selected ? (
            <p>You selected {format(selected, 'PPP')}</p>
          ) : (
            <p>Please pick a day.</p>
          )
        }
      />
    </div>
  );
};

export default DatePicker;

