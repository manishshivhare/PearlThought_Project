import React, { useState } from "react";
import dayjs from "dayjs";
import ConfirmationModal from "./ConfirmationModal";

const MiniCalendar = ({ events, onRemoveEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [selectedEventDate, setSelectedEventDate] = useState("");

  const formatDate = (date) => dayjs(date).format("D MMM YYYY");

  const openModal = (index, date) => {
    setSelectedEventIndex(index);
    setSelectedEventDate(date);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedEventIndex !== null) {
      onRemoveEvent(selectedEventIndex);
    }
    setIsModalOpen(false);
    setSelectedEventIndex(null);
    setSelectedEventDate("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventIndex(null);
    setSelectedEventDate("");
  };

  return (
    <div className="mini-calendar bg-white shadow-md rounded-md p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-500">No events scheduled</p>
      ) : (
        events.map((event, index) => {
          const startDate = dayjs(event.startDate);

          return (
            <div
              key={index}
              className="event bg-gray-50 border border-gray-200 rounded-md p-4 mb-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {formatDate(startDate)} at {event.time}
                </h3>
                <p className="text-xs text-gray-600">Repeat: {event.repeat}</p>
                <p className="text-xs text-gray-800">Do: {event.description}</p>
              </div>
              <button
                className="text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => openModal(index, formatDate(startDate))}
                aria-label={`Remove event from ${formatDate(startDate)}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          );
        })
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        eventDate={selectedEventDate}
      />
    </div>
  );
};

export default MiniCalendar;
