import React, { useState, useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import DateSelector from "./DateSelector";
import useDateStore from "../Zustand/store.js"; // Import Zustand store
import { day } from "../utils/Calendar.js";
import cn from "../utils/cn.js";

const CustomRecurrenceModal = ({ onClose }) => {
  const { startDate, setRepeat } = useDateStore();
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatType, setRepeatType] = useState("week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [endCondition, setEndCondition] = useState("never");
  const [occurrences, setOccurrences] = useState(10);
  const [endDate, setEndDate] = useState(null);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [error, setError] = useState(null); // State for error message

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const repeatOptions = useMemo(() => {
    const selectedDate = dayjs(startDate, "D MMM YYYY");
    return [`Monthly on day ${selectedDate.format("D")}`];
  }, [startDate]);

  const handleDateSelectorClose = (selectedDate) => {
    setShowDateSelector(false);
    if (selectedDate) {
      if (dayjs(selectedDate).isBefore(dayjs(startDate), "day")) {
        setError("End date must be same as start or after the start date.");
      } else {
        setEndDate(selectedDate);
        setError(null); // Clear error if date is valid
      }
    }
  };

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEndConditionChange = (condition) => {
    setError("");
    setEndCondition(condition);
    if (condition === "on") setShowDateSelector(true);
  };

  const constructRecurrenceString = useMemo(() => {
    let recurrenceString = `Every ${repeatEvery} ${repeatType}${
      repeatEvery > 1 ? "s" : ""
    }`;

    if (repeatType === "week" && selectedDays.length > 0) {
      const sortedSelectedDays = [...selectedDays].sort((a, b) => a - b);
      const selectedDaysString = sortedSelectedDays
        .map((index) => day[index].substring(0, 3))
        .join(", ");
      recurrenceString += ` on ${selectedDaysString}`;
    }

    switch (endCondition) {
      case "never":
        recurrenceString += ", never ends";
        break;
      case "on":
        if (endDate) {
          recurrenceString += ` until ${dayjs(endDate).format("D MMM YYYY")}`;
        }
        break;
      case "after":
        recurrenceString += ` for ${occurrences} occurrences`;
        break;
      default:
        break;
    }

    return recurrenceString;
  }, [
    repeatEvery,
    repeatType,
    selectedDays,
    endCondition,
    occurrences,
    endDate,
  ]);

  const handleSaveRecurrenceRule = useCallback(() => {
    if (endCondition === "on" && !endDate) {
      setError("Please select an end date.");
      return;
    }

    if (
      endCondition === "on" &&
      dayjs(endDate).isBefore(dayjs(startDate), "day")
    ) {
      setError("End date must be the same as or after the start date.");
      return;
    }

    const recurrenceRule = {
      repeatEvery: parseInt(repeatEvery, 10),
      repeatType,
      selectedDays,
      endCondition,
      occurrences:
        endCondition === "after" ? parseInt(occurrences, 10) : undefined,
      endDate: endCondition === "on" ? endDate : undefined,
    };

    setRepeat(constructRecurrenceString);

    if (onClose) onClose(constructRecurrenceString);
  }, [
    repeatEvery,
    repeatType,
    selectedDays,
    endCondition,
    occurrences,
    endDate,
    setRepeat,
    onClose,
    constructRecurrenceString,
  ]);

  const handleCancel = () => {
    setRepeat("Doesn't repeat");
    if (onClose) onClose();
  };

  useEffect(() => {
    if (repeatType === "week" && selectedDays.length === 0) {
      const currentDayIndex = dayjs().day();
      setSelectedDays([currentDayIndex]);
    }
  }, [repeatType, selectedDays.length]);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recurrence-modal-title"
    >
      <div className="bg-white shadow-lg rounded-lg p-2 w-76 max-w-[276px] h-auto">
        <h2
          id="recurrence-modal-title"
          className="text-xl font-semibold mb-2 border-b-2 text-gray-800"
        >
          Custom Recurrence
        </h2>

        {error && (
          <div className="mb-2 p-1 bg-red-50 text-red-500 text-sm border-red-300 rounded">
            {error}
          </div>
        )}
        <div className="bg-gray-200 rounded p-2">
          <div className="flex items-center mb-2 ">
            <label className="mr-2 text-gray-700" htmlFor="repeatEvery">
              Repeat every
            </label>
            <input
              id="repeatEvery"
              type="number"
              min="1"
              value={repeatEvery}
              onChange={(e) => setRepeatEvery(e.target.value)}
              className="border rounded-md w-16 text-center focus:outline-none "
              aria-label="Repeat every"
            />
            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
              className="border rounded-md ml-2 focus:outline-none "
              aria-label="Repeat type"
            >
              <option value="day">day</option>
              <option value="week">week</option>
              <option value="month">month</option>
              <option value="year">year</option>
            </select>
          </div>

          {repeatType === "month" && (
            <div className="flex items-center mb-1">
              <select
                value=""
                onChange={(e) => {}}
                className="border rounded-md px-3 py-1 text-sm w-full focus:outline-none"
              >
                {repeatOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {repeatType === "week" && (
            <div className="flex items-center mb-1">
              <span className="mr-2 text-gray-700">Repeat on</span>
              <div className="flex gap-1">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDaySelection(index)}
                    className={`rounded-full w-5 h-5 flex items-center justify-center focus:outline-none text-xs  ${
                      selectedDays.includes(index)
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100 bg-white"
                    }`}
                    aria-pressed={selectedDays.includes(index)}
                    aria-label={`Repeat on ${day}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-200 rounded p-2 mt-2">
        <div className="mb-1">
          <div className="mb-2 font-medium text-gray-700">End</div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="never"
              checked={endCondition === "never"}
              onChange={() => handleEndConditionChange("never")}
              aria-labelledby="never"
            />
            <label htmlFor="never" className="ml-2 text-gray-700">
              Never
            </label>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="on"
              checked={endCondition === "on"}
              onChange={() => handleEndConditionChange("on")}
              aria-labelledby="on"
            />
            <label htmlFor="on" className="ml-2 text-gray-700">
              On
            </label>
            {endCondition === "on" && (
              <input
                type="text"
                value={endDate ? dayjs(endDate).format("D MMM YYYY") : ""}
                readOnly
                className="bg-white rounded ml-2 cursor-pointer focus:outline-none px-2 py-1 text-sm "
                onClick={() => setShowDateSelector(true)}
                aria-label="End date"
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="after"
              checked={endCondition === "after"}
              onChange={() => handleEndConditionChange("after")}
              aria-labelledby="after"
            />
            <label htmlFor="after" className="ml-2 text-gray-700">
              After
            </label>
            {endCondition === "after" && (
              <input
                type="number"
                min="1"
                value={occurrences}
                onChange={(e) => setOccurrences(e.target.value)}
                className="border rounded-md ml-2 w-16 focus:outline-none text-center"
                aria-label="Occurrences"
              />
            )}
          </div>
        </div>
        </div>
        <div className="mt-2 border text-sm bg-gray-200 p-1 rounded mb-1 min-h-[50px]">
          {constructRecurrenceString}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="hover:bg-gray-50 text-gray px-2 py-1 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRecurrenceRule}
            disabled={error}
            className="text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-50 transition-all"
          >
            Save
          </button>
        </div>
      </div>

      {showDateSelector && (
        <DateSelector
          onClose={handleDateSelectorClose}
          title="Select End Date"
        />
      )}
    </div>
  );
};

export default CustomRecurrenceModal;
