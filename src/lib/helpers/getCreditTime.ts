// Updated dateRanges with the corrected last object
const dateRanges = [
  { submitted: "6:45 AM – 9:30 AM", creditTime: "11:10 AM" },
  { submitted: "9:30 AM – 12:00 PM", creditTime: "1:40 PM" },
  { submitted: "12:00 PM – 2:30 PM", creditTime: "4:10 PM" },
  { submitted: "2:30 PM – 4:45 PM", creditTime: "5:40 PM" },
  {
    submitted: "4:45 PM – 6:45 AM",
    creditTime: "9:00 AM (Following Business Day)",
  },
];

export default function getCreditTime(inputDate: string) {
  // Convert the input date to a JavaScript Date object
  const date = new Date(inputDate);

  // Extract the time in HH:MM format
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const inputTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;

  // Iterate through the dateRanges to find a match
  for (const range of dateRanges) {
    const [startTime, endTime] = range.submitted.split(" – ");

    // Convert times to minutes since midnight for easier comparison
    const inputTimeInMinutes = convertTimeToMinutes(inputTime);
    const startTimeInMinutes = convertTimeToMinutes(startTime);
    const endTimeInMinutes = convertTimeToMinutes(endTime);

    // Handle the case where the range spans midnight (e.g., 4:45 PM – 6:45 AM)
    if (startTimeInMinutes > endTimeInMinutes) {
      if (
        inputTimeInMinutes >= startTimeInMinutes ||
        inputTimeInMinutes <= endTimeInMinutes
      ) {
        return range.creditTime;
      }
    } else {
      if (
        inputTimeInMinutes >= startTimeInMinutes &&
        inputTimeInMinutes <= endTimeInMinutes
      ) {
        return range.creditTime;
      }
    }
  }

  // If no range matches, return null or a default value
  return null;
}

function convertTimeToMinutes(time: string) {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}
