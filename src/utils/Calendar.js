import dayjs from "dayjs";

export const generateDate = (
  month = dayjs().month(),
  year = dayjs().year()
) => {
  const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
  const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

  const arrayOfDate = [];

  for(let i = 0; i<firstDateOfMonth.day(); i++){
    arrayOfDate.push({
      date: firstDateOfMonth.day(i),
      currentMonth: false
    })
  }
  // generate current date
  for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
    arrayOfDate.push({
      date: firstDateOfMonth.date(i),
      currentMonth:true,
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
