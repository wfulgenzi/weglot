// A set of helper functions for comparing and manipulating timeslot data.

const compareByStartTime = (a, b) => {
  if (a.start < b.start) {
    return -1;
  }
  if (a.start > b.start) {
    return 1;
  }
  return 0;
};

const timeStringToNum = timeString => {
  const [hours, minutes] = timeString.split(":").map(x => parseInt(x));
  return hours + minutes / 60;
};

const timeNumToString = timeNum => {
  const hours = Math.floor(timeNum);
  const minutes = Math.round((timeNum - hours) * 60);
  const minutesString =
    minutes < 10 ? "0" + minutes.toString() : minutes.toString();
  const hoursString = hours < 10 ? "0" + hours.toString() : hours.toString();
  return hoursString + ":" + minutesString;
};

const formatFreeTime = freeTime => {
  const { day, start, end } = freeTime;
  if (!freeTime) return "No free time was found for this week.";
  return (
    day.toString() + " " + timeNumToString(start) + "-" + timeNumToString(end)
  );
};

module.exports = {
  compareByStartTime,
  timeStringToNum,
  formatFreeTime
};
