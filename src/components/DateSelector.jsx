import dayjs from "dayjs";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { generateDate, months } from "../utils/Calendar.js";
import cn from "../utils/cn.js";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const DateSelector = ({ onClose }) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const [displayedDate, setDisplayedDate] = useState(dayjs());
  const [date, setDate] = useState("");
  const modalRef = useRef(null);

  const handleDateSelect = useCallback(
    (date) => {
      setDate(date);
      
      if (onClose) onClose(date);
    },
    [setDate, onClose]
  );

  const handleTodayClick = useCallback(() => {
    const today = dayjs();
    setDate(today);
    setDisplayedDate(today);
  }, [setDate, onClose]);

  const handleMonthChange = useCallback(
    (direction) => {
      const newDate =
        direction === "prev"
          ? displayedDate.subtract(1, "month")
          : displayedDate.add(1, "month");
      setDisplayedDate(newDate);
    },
    [displayedDate]
  );

  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

 
  const formattedCurrentDate = dayjs();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-2">
      <div
        ref={modalRef}
        className="w-72 bg-white shadow-md rounded-md p-2 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2 relative">
          <button
            aria-label="Previous month"
            className="text-lg p-1 rounded hover:bg-gray-200 focus:outline-none"
            onClick={() => handleMonthChange("prev")}
          >
            <GrFormPrevious />
          </button>
          <div className="flex-1 text-center relative">
            <h1
              className="text-sm font-semibold cursor-pointer rounded hover:bg-gray-200 focus:outline-none"
              onClick={handleTodayClick}
            >
              {months[displayedDate.month()]} {displayedDate.year()}
            </h1>
          </div>
          <button
            aria-label="Next month"
            className="text-lg p-1 rounded hover:bg-gray-200 focus:outline-none"
            onClick={() => handleMonthChange("next")}
          >
            <GrFormNext />
          </button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-1">
          {days.map((day, index) => (
            <div key={index} className="p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-1">
          {generateDate(displayedDate.month(), displayedDate.year()).map(
            ({ date, today, currentMonth }, index) => (
              <div key={index} className="text-center">
                <button
                  className={cn(
                    "h-6 w-6 flex items-center justify-center rounded-full transition-colors",
                    today ? "bg-red-600 text-white" : "",
                    currentMonth ? "" : "text-gray-300",
                    formattedCurrentDate.isSame(date, "day")
                      ? "bg-black text-white"
                      : "",
                    "hover:bg-black hover:text-white"
                  )}
                  onClick={() => handleDateSelect(date)}
                  aria-label={`Select ${date.format("D MM YYYY")}`}
                >
                  {date.date()}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
