import { create } from "zustand";
import dayjs from "dayjs";

const useDateStore = create((set) => ({
  startDate: dayjs().startOf("day"),
  repeat: "Doesn't repeat",
  description: "",
  time: dayjs().format("HH:mm"),

  setStartDate: (date) => set({ startDate: date }),
  setTime: (time) =>
    set({
      time: time,
    }),
  setEndDate: (date) => set({ endDate: date }),
  setRepeat: (value) => set({ repeat: value }),
  setDescription: (value) => set({ description: value }),
}));

export default useDateStore;
