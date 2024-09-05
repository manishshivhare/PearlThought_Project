import dayjs from "dayjs";

export const generateDate = (
  month = dayjs().month(),
  year = dayjs().year()
) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

  const arrayOfDate = [];

  for (let i = 0; i < firstDateOfMonth.day(); i++) {
    arrayOfDate.push({
      date: firstDateOfMonth.day(i),
      currentMonth: false,
    });
  }
  // generate current date
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    arrayOfDate.push({
      date: firstDateOfMonth.date(i),
      currentMonth: true,
      today:
        firstDateOfMonth.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
    });
  }
  return arrayOfDate;
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayOccurrence(day = new Date().getDate(), month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Create a date object from the provided or default values
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = targetDate.getDay(); // Get the day of the week (0-6)
  const dayName = dayMap[dayOfWeek];
  
  let occurrenceCount = 0;

  // Iterate from the 1st of the given month to the target date
  for (let d = 1; d <= day; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() === dayOfWeek) {
      occurrenceCount++;
    }
  }

  // Determine the occurrence as ordinal (e.g., 1st, 2nd, 3rd)
  const ordinalSuffixes = ['th', 'st', 'nd', 'rd'];
  const suffixIndex = occurrenceCount % 10 <= 3 ? occurrenceCount % 10 : 0;
  const ordinalOccurrence = occurrenceCount + (ordinalSuffixes[suffixIndex] || 'th');

  return `${ordinalOccurrence} ${dayName}`;
}


