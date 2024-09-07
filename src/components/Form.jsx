import React, { useState, useEffect, useRef } from "react";
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
  const [isCustomRecurrenceModalOpen, setIsCustomRecurrenceModalOpen] =
    useState(false);
  const [events, setEvents] = useState(
    JSON.parse(localStorage.getItem("events")) || []
  );
  const [repeatOptions, setRepeatOptions] = useState([]);

  const formatDate = (date) => dayjs(date).format("D MMM YYYY");
  const buttonRef = useRef(null);

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
      description: description || "Nothing serious",
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

  useEffect(() => {
    if (repeat === "Custom...") {
      setIsCustomRecurrenceModalOpen(true);
    } else if (!repeatOptions.includes(repeat)) {
      setRepeatOptions((prevOptions) => {
        const newOptions = prevOptions.filter(
          (option) => option !== "Custom..."
        );
        return [...newOptions, repeat, "Custom..."];
      });
    }
  }, [repeat,repeatOptions]);

  const handleCustomRecurrenceModalClose = (customRepeat) => {
    if (customRepeat) {
      setRepeat(customRepeat);
    } else {
      setRepeat("Doesn't repeat");
    }
    setIsCustomRecurrenceModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="task-form bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <div className="tabs flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold">Reminder</h2>
        </div>

        <div className="flex mb-4 gap-3 items-center">
          <div
            className="date-time-picker hover:bg-gray-200 flex items-center gap-3 border border-gray-300 rounded p-2 cursor-pointer transition-all"
            onClick={() => setShowDateSelector(true)}
            ref={buttonRef}
            role="button"
            aria-label="Select Date"
          >
            <label className="block text-md font-medium text-gray-700">
              For:
            </label>
            <span className="text-gray-600">{date}</span>
          </div>
        </div>

        {showDateSelector && (
          <>
            <DateSelector
              anchorRef={buttonRef}
              onClose={handleDateSelectorClose}
              className="modal-fullscreen"
            />
            <div
              className="fixed bg-black bg-opacity-50 z-40"
              onClick={() => setShowDateSelector(false)}
            />
          </>
        )}

        <div className="repeat-dropdown mb-4">
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full transition focus:outline-none cursor-pointer"
            aria-label="Repeat Options"
          >
            {repeatOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="description mb-4">
          <textarea
            placeholder="What to remind"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="border rounded w-full px-3 py-2 text-sm bg-gray-100 text-gray resize-none focus:outline-none  "
            aria-label="Reminder Description"
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full transition duration-300 ease-in-out transform hover:bg-blue-600 "
          aria-label="Add Reminder"
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

      <div className="mini-calendar-container w-full mt-6 max-w-md overflow-x-auto">
        <MiniCalendar events={events} onRemoveEvent={handleRemoveEvent} />
      </div>
    </div>
  );
};

export default Form;
