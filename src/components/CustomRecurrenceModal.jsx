import React, { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import DateSelector from "./DateSelector";
import useDateStore from "../Zustand/store.js"; // Import Zustand store

const CustomRecurrenceModal = ({ onClose }) => {
  const { endDate, setEndDate, startDate } = useDateStore(); // Use Zustand store for end date
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatType, setRepeatType] = useState("week");
  const [selectedDays, setSelectedDays] = useState([]);
  const [endCondition, setEndCondition] = useState("never");
  const [occurrences, setOccurrences] = useState(10);
  const [showDateSelector, setShowDateSelector] = useState(false);

  const { setRepeat } = useDateStore();
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const [repeatOptions, setRepeatOptions] = useState([]);
  const handleDateSelectorClose = (selectedDate) => {
    setEndDate(dayjs(selectedDate)); // Use dayjs for consistent date handling
    setShowDateSelector(false);
  };

  useEffect(() => {
    const selectedDate = dayjs(startDate, "D MMM YYYY");
    setRepeatOptions([`Monthly on day ${selectedDate.format("D")}`]);
  }, [startDate]);

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEndConditionChange = (condition) => {
    setEndCondition(condition);
    if (condition === "on") setShowDateSelector(true);
  };

  const handleSubmit = useCallback(() => {
    const recurrenceRule = {
      repeatEvery,
      repeatType,
      selectedDays,
      endCondition,
      occurrences: endCondition === "after" ? occurrences : undefined,
      endDate: endCondition === "on" ? endDate : undefined,
    };

    setRepeat(recurrenceRule); // Save the recurrence rule to Zustand
    if (onClose) onClose();
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

  // Set the current weekday as default if repeat type is "week" and nothing is selected
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

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button onClick={handleSubmit} className="text-blue-500">
            Done
          </button>
        </div>
      </div>

      {showDateSelector && (
        <DateSelector
          onClose={handleDateSelectorClose}
          isStartDate={false} // Specify it's for end date selection
        />
      )}
    </div>
  );
};

export default CustomRecurrenceModal;
