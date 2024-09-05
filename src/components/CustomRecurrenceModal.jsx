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
      const selectedDaysString = selectedDays
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
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-2">
      <div className="bg-white shadow-md rounded-md p-4 w-80">
        <h2 className="text-lg font-semibold mb-4">Custom Recurrence</h2>

        {/* Recurrence Interval */}
        <div className="flex items-center mb-4">
          <span className="mr-2">Repeat every</span>
          <input
            type="number"
            min="1"
            value={repeatEvery}
            onChange={(e) => setRepeatEvery(e.target.value)}
            className="border rounded w-16 text-center"
            aria-label="Repeat every"
          />
          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
            className="border rounded ml-2"
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
              className="border rounded px-2 py-1 text-sm w-full"
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
            <span className="mr-2">Repeat on</span>
            <div className="flex gap-1">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDaySelection(index)}
                  className={`border rounded-full w-6 h-6 flex items-center justify-center ${
                    selectedDays.includes(index) ? "bg-blue-500 text-white" : ""
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
        <div className="mb-4">
          <div className="mb-3">End</div>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="never"
              checked={endCondition === "never"}
              onChange={() => handleEndConditionChange("never")}
              aria-labelledby="never"
            />
            <label htmlFor="never" className="ml-2">
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
            <label htmlFor="on" className="ml-2">
              On
            </label>
            {endCondition === "on" && (
              <input
                type="text"
                value={endDate ? dayjs(endDate).format("D MMM YYYY") : ""}
                readOnly
                className="border rounded ml-2 cursor-pointer"
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
            <label htmlFor="after" className="ml-2">
              After
            </label>
            {endCondition === "after" && (
              <input
                type="number"
                min="1"
                value={occurrences}
                onChange={(e) => setOccurrences(e.target.value)}
                className="border rounded ml-2 w-16"
                aria-label="Occurrences"
              />
            )}
            <span className="ml-2">occurrences</span>
          </div>
        </div>

        {/* Custom Buttons Section */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel} // Cancel button logic
            className="text-gray-600 bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRecurrenceRule}
            className="text-white bg-blue-500 rounded-md px-4 py-2 hover:bg-blue-600"
            aria-label="Save"
          >
            Save
          </button>
        </div>

        {/* DateSelector component */}
        {showDateSelector && (
          <DateSelector
            onClose={handleDateSelectorClose}
            selectedDate={endDate}
          />
        )}
      <div className="mt-3 border text-sm bg-gray-200 p-1 rounded">{constructRecurrenceString}</div>
      </div>
    </div>
  );
};

export default CustomRecurrenceModal;
