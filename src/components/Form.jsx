import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import DateSelector from "./DateSelector.jsx";
import MiniCalendar from "./MiniCalendar.jsx";
import CustomRecurrenceModal from "./CustomRecurrenceModal";
import useDateStore from "../Zustand/store.js";

const Form = () => {
  const {
    startDate,
    repeat,
    description,
    setStartDate,
    setRepeat,
    setDescription,
  } = useDateStore();

  const [date, setDate] = useState(dayjs().format("D MMM YYYY"));
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [isCustomRecurrenceModalOpen, setIsCustomRecurrenceModalOpen] = useState(false);
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem("events")) || []);
  const [repeatOptions, setRepeatOptions] = useState([]);

  const formatDate = (date) => dayjs(date).format("D MMM YYYY");

  const handleDateSelectorClose = (selectedDate) => {
    const formattedDate = formatDate(selectedDate);
    setDate(formattedDate);
    setStartDate(dayjs(selectedDate).startOf("day"));
    setShowDateSelector(false);
  };

  const handleRemoveEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleSubmit = () => {
    const newEvent = {
      startDate,
      repeat,
      description,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setStartDate(dayjs().startOf("day"));
    setDescription("");
    setRepeat("Doesn't repeat");
  };

  useEffect(() => {
    const selectedDate = dayjs(date, "D MMM YYYY");
    setRepeatOptions([
      
      "Daily",
      `Weekly on ${selectedDate.format("dddd")}`,
      `Monthly on ${selectedDate.format("D")}`,
      `Annually on ${selectedDate.format("D MMM")}`,
      "Custom...",
    ]);
  }, [date]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Update options when repeat changes
  useEffect(() => {
    if (repeat === "Custom...") {
      setIsCustomRecurrenceModalOpen(true);
    } else if (!repeatOptions.includes(repeat)) {
      setRepeatOptions((prevOptions) => {
        const newOptions = prevOptions.filter((option) => option !== "Custom...");
        return [...newOptions, repeat, "Custom..."];
      });
    }
  }, [repeat]);

  const handleCustomRecurrenceModalClose = (customRepeat) => {
    if (customRepeat) {
      setRepeat(customRepeat);
    } else {
      setRepeat("Doesn't repeat");
    }
    setIsCustomRecurrenceModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="task-form bg-white shadow-lg rounded-md p-4 w-full max-w-md">
        <div className="tabs flex justify-between border-b pb-2 mb-3">
          Reminder
        </div>

        <div className="flex mb-3 gap-2">
          <div
            className="date-time-picker flex gap-3 border border-gray-300 rounded p-2 cursor-pointer hover:border-blue-500 transition-all"
            onClick={() => setShowDateSelector(true)}
          >
            <label className="block text-md font-medium text-gray-700 mb-1">
              For:
            </label>
            {date}
          </div>
        </div>

        {showDateSelector && (
          <>
            <DateSelector
              onClose={handleDateSelectorClose}
              className="modal-fullscreen"
            />
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowDateSelector(false)}
            />
          </>
        )}

        <div className="repeat-dropdown mb-3">
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            {repeatOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="description mb-3">
          <textarea
            placeholder="What to remind"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full px-2 py-1 text-sm"
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Add reminder
        </button>
      </div>

      {isCustomRecurrenceModalOpen && (
        <CustomRecurrenceModal
          onClose={handleCustomRecurrenceModalClose}
          className="modal-fullscreen"
        />
      )}

      <div className="mini-calendar-container w-full mt-4 max-w-md overflow-x-auto">
        <MiniCalendar events={events} onRemoveEvent={handleRemoveEvent} />
      </div>
    </div>
  );
};

export default Form;
