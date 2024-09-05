import React, { useState, useCallback, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import DateSelector from "./DateSelector";
import useDateStore from "../Zustand/store.js"; // Import Zustand store
import { day } from "../utils/Calendar.js";

const CustomRecurrenceModal = ({ onClose }) => {
  const { repeat, startDate, setRepeat } = useDateStore(); // Use Zustand store
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatType, setRepeatType] = useState("week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [endCondition, setEndCondition] = useState("never");
  const [occurrences, setOccurrences] = useState(10);
  const [endDate, setEndDate] = useState(null); // Local state for endDate
  const [showDateSelector, setShowDateSelector] = useState(false);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const repeatOptions = useMemo(() => {
    const selectedDate = dayjs(startDate, "D MMM YYYY");
    return [`Monthly on day ${selectedDate.format("D")}`];
  }, [startDate]);

  const handleDateSelectorClose = (selectedDate) => {
    setShowDateSelector(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEndConditionChange = (condition) => {
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
  ]);

  // Function to handle cancel and reset state
  const handleCancel = () => {
    setRepeat("Doesn't repeat"); // Reset repeat to default
    if (onClose) onClose(); // Close the modal without saving
  };

  useEffect(() => {
    if (repeatType === "week" && selectedDays.length === 0) {
      const currentDayIndex = dayjs().day(); // Get the current weekday index (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      setSelectedDays([currentDayIndex]); // Set current day as default
    }
  }, [repeatType, selectedDays.length]);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recurrence-modal-title"
    >
      <div className="bg-white shadow-lg rounded-lg p-4 w-content max-w-full">
        <h2
          id="recurrence-modal-title"
          className="text-xl font-semibold mb-4 text-gray-800"
        >
          Custom Recurrence
        </h2>

        {/* Recurrence Interval */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-gray-700" htmlFor="repeatEvery">
            Repeat every
          </label>
          <input
            id="repeatEvery"
            type="number"
            min="1"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(e.target.value)}
            className="border rounded-md w-16 text-center focus:ring focus:ring-blue-200"
            aria-label="Repeat every"
          />
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
            className="border rounded-md ml-2 focus:ring focus:ring-blue-200"
            aria-label="Repeat type"
          >
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>
            <option value="year">year</option>
          </select>
        </div>

        {repeatType === "month" && (
          <div className="flex items-center mb-4">
            <select
              value=""
              onChange={(e) => {}}
              className="border rounded-md px-3 py-1 text-sm w-full focus:ring focus:ring-blue-200"
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
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-700">Repeat on</span>
            <div className="flex gap-1">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDaySelection(index)}
                  className={`border rounded-full w-8 h-8 flex items-center justify-center focus:outline-none ${
                    selectedDays.includes(index)
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
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

        {/* End Condition Section */}
        <div className="mb-6">
          <div className="mb-3 font-medium text-gray-700">End</div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="never"
              checked={endCondition === "never"}
              onChange={() => handleEndConditionChange("never")}
              className="focus:ring focus:ring-blue-200"
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
              className="focus:ring focus:ring-blue-200"
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
                className="border rounded-md ml-2 cursor-pointer focus:outline-none focus:ring focus:ring-blue-200"
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
              className="focus:ring focus:ring-blue-200"
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
                className="border rounded-md ml-2 w-16 focus:outline-none focus:ring focus:ring-blue-200"
                aria-label="Occurrences"
              />
            )}
          </div>
        </div>
        <div className="mt-3 border text-sm bg-gray-200 p-1 rounded mb-3">
          {constructRecurrenceString}
        </div>
        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="hover:bg-gray-100 text-gray px-2 py-1 rounded-lg  transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRecurrenceRule}
            className=" text-blue px-2 py-1 rounded-lg hover:bg-blue-100 transition-all"
          >
            Save
          </button>
        </div>
      </div>

      {/* Date Selector Modal */}
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
