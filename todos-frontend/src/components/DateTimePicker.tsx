import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, addMonths, subMonths } from "date-fns";
import { useState } from "react";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, setDate }) => {
  const [time, setTime] = useState({
    hours: date.getHours() % 12 || 12,
    minutes: date.getMinutes(),
    period: date.getHours() >= 12 ? 'PM' : 'AM'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const startOfWeek = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const handleDayClick = (day: number) => {
    const newSelectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setDate(newSelectedDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newTime = { ...time, [name]: Number(value) };
    setTime(newTime);
    const hours24 = newTime.period === 'PM' ? (newTime.hours % 12) + 12 : newTime.hours % 12;
    const newSelectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours24, newTime.minutes);
    setDate(newSelectedDate);
  };

  const handlePeriodToggle = () => {
    const newPeriod = time.period === 'AM' ? 'PM' : 'AM';
    const newTime = { ...time, period: newPeriod };
    setTime(newTime);
    const hours24 = newPeriod === 'PM' ? (time.hours % 12) + 12 : time.hours % 12;
    const newSelectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours24, time.minutes);
    setDate(newSelectedDate);
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          onClick={() => handleDayClick(i)}
          className={`day ${
            date.getDate() === i && date.getMonth() === currentMonth.getMonth()
              ? "selected"
              : ""
          }`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div>
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeftIcon width={20} height={20} />
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRightIcon width={20} height={20} />
        </button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-of-week">
            {day}
          </div>
        ))}
        {Array.from({ length: startOfWeek }).map((_, index) => (
          <div key={index} className="empty-day" />
        ))}
        {renderDays()}
      </div>
      <div className="time-picker">
      <input
          type="number"
          name="hours"
          value={time.hours}
          onChange={handleTimeChange}
          min="1"
          max="12"
          className="time-input"
        />
        :
        <input
          type="number"
          name="minutes"
          value={time.minutes}
          onChange={handleTimeChange}
          min="0"
          max="59"
          className="time-input"
        />
        <button onClick={handlePeriodToggle}>{time.period}</button>
      </div>
    </div>
  );
};

export default DateTimePicker;
