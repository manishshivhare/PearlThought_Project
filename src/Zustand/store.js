import {create} from 'zustand';
import dayjs from 'dayjs';

const useDateStore = create((set) => ({
  startDate: dayjs().startOf('day'),
  repeat: "Doesn't repeat",
  description: '',
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRepeat: (value) => set({ repeat: value }),
  setDescription: (value) => set({ description: value }),
}));

export default useDateStore;