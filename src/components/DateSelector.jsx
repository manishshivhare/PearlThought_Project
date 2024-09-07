import dayjs from "dayjs";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { generateDate, months, daysChar } from "../utils/Calendar.js";
import cn from "../utils/cn.js";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const DateSelector = ({ onClose, anchorRef }) => {
  const [displayedDate, setDisplayedDate] = useState(dayjs());
  const modalRef = useRef(null);

  //useMemo to avoid recomputations
  const today = useMemo(() => dayjs(), []);
  const daysOfWeek = useMemo(() => daysChar, []);
  const dates = useMemo(
    () => generateDate(displayedDate.month(), displayedDate.year()),
    [displayedDate]
  );

  //called when user select any date
  const handleDateSelect = useCallback(
    (date) => {
      if (onClose) onClose(date);
    },
    [onClose]
  );

  //reset calendar to today
  const handleTodayClick = useCallback(() => {
    setDisplayedDate(today);
  }, [today]);

  //handling month changes using arrows
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

  //ensure calendar closed when click outside of calendar
  const handleClickOutside = useCallback(
    (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    },
    [onClose]
  );

  //listining to mouse outside click event
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [handleClickOutside]);

  //tracking changes in refrence of modal like calendar
  useEffect(() => {
    if (anchorRef?.current && modalRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      modalRef.current.style.top = `${anchorRect.bottom + window.scrollY}px`;
      modalRef.current.style.left = `${anchorRect.left + window.scrollX}px`;
    }
  }, [anchorRef]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="absolute bg-white shadow-md rounded-md p-1 z-50"
      style={{ minWidth: "200px" }}
    >
      <div className="flex justify-between items-center mb-1 relative">
        <button
          aria-label="Previous month"
          className="text-sm p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-opacity-50"
          onClick={() => handleMonthChange("prev")}
        >
          <GrFormPrevious />
        </button>
        <div className="flex-1 text-center relative">
          <h1
            className="text-xs font-semibold cursor-pointer rounded hover:bg-gray-200 focus:outline-none"
            onClick={handleTodayClick}
          >
            {months[displayedDate.month()]} {displayedDate.year()}
          </h1>
        </div>
        <button
          aria-label="Next month"
          className="text-sm p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:ring-opacity-50"
          onClick={() => handleMonthChange("next")}
        >
          <GrFormNext />
        </button>
      </div>

      <div className="grid grid-cols-7 text-[10px] text-center text-gray-500 mb-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="p-0.5">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {dates.map(({ date, today: isToday, currentMonth }, index) => (
          <div key={index} className="text-center">
            <button
              className={cn(
                "h-5 w-5 flex items-center justify-center rounded-full text-xs transition-all duration-200 ease-in-out",
                isToday ? "bg-red-600 text-white" : "",
                currentMonth ? "" : "text-gray-300",
                today.isSame(date, "day") ? "bg-black text-white" : "",
                "hover:bg-black hover:text-white focus:ring focus:ring-opacity-50"
              )}
              onClick={() => handleDateSelect(date)}
              aria-label={`Select ${date.format("D MM YYYY")}`}
            >
              {date.date()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
