import "./App.css";
import cn from "./utils/cn.js";
import { generateDate } from "./utils/Calendar.js";

export default function App() {
  console.log(generateDate());
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="flex gap-10 sm:divide-x justify-center sm:w-1/2 mx-auto  h-screen items-center sm:flex-row flex-col">
      <div className="w-96 h-96">
        <div className="w-full grid grid-cols-7 ">
          {days.map((day, index) => {
            return (
              <div className="h-14 border-t grid place-content-center text-sm">
                <h1 key={index}>{day}</h1>
              </div>
            );
          })}
        </div>
        <div className="w-full grid grid-cols-7">
          {generateDate().map(({ date, currentMonth, today }, index) => {
            return (
              <div className="h-14 border-t grid place-content-center text-sm">
                <h1
                  key={index}
                  className={cn(
                    currentMonth ? "" : "text-gray-400",
                    today ? "bg-red-600 text-white" : "",
                    "h-10 w-10 grid place-content-center rounded-full hover:bg-black hover:text-white transition-all cursor-pointer"
                  )}
                >
                  {date.date()}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-96 w-96 sm:px-5">
        <h1>Meetings</h1>
        <p>Hello</p>
      </div>
    </div>
  );
}
