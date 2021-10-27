const fs = require("fs");

const {
  compareByStartTime,
  timeStringToNum,
  formatFreeTime
} = require("./helpers");

const {
  START_HOUR, // Time the workday begins
  END_HOUR, // Time the workday ends
  MEETING_LENGTH, // Length of the free slot we need to find for a meeting.
  MINIMUM_GAP, // Time interval between when one meeting can end and the next begin (with the same participant).
  INPUTS_DIR, // Path to input data files
  INPUT_ENCODING // Encoding of input data files
} = require("./vars");

// Takes a single input file of unavailabilities and returns the first free timeslot as a string.
const processInput = filename => {
  let data;
  try {
    data = fs.readFileSync(`${INPUTS_DIR}/${filename}`, INPUT_ENCODING);
  } catch (error) {
    console.error(`An error occurred reading input file ${filename}`);
    return;
  }
  const busyTimes = prepareInputData(data);
  const freeTime = findFreeTime(busyTimes);
  const freeTimeString = formatFreeTime(freeTime);
  console.log(`Processed: ${filename} \n${freeTimeString}\n\n`);
  return freeTimeString;
};

// Processes input data and returns the structured unavailable timeslots for the week.
const prepareInputData = data => {
  const rows = data.split("\n");
  const weekBusySlots = {};
  for (let row of rows) {
    const day = parseInt(row.split(" ")[0]);
    // Store times as hour decimals to facilitate comparisons.
    const [startTime, endTime] = row
      .split(" ")[1]
      .split("-")
      .map(timeString => timeStringToNum(timeString));

    if (weekBusySlots[day]) {
      weekBusySlots[day].push({
        start: startTime,
        end: endTime
      });
    } else {
      weekBusySlots[day] = [
        {
          start: startTime,
          end: endTime
        }
      ];
    }
  }
  return weekBusySlots;
};

// Search through the set of a week's busy slots and return the soonest availability.
const findFreeTime = weekBusySlots => {
  let freeTime = null;
  for (let day = 1; day <= 5; day++) {
    if (!weekBusySlots[day]) {
      // No unavailabilities today, so schedule a meeting at start of day.
      freeTime = {
        day: day,
        startTime: START_HOUR,
        endTime: START_HOUR + MEETING_LENGTH
      };
      return freeTime;
    }
    const sortedBusySlots = weekBusySlots[day].sort(compareByStartTime);
    let unavailableTime = sortedBusySlots[0];
    if (unavailableTime.start >= START_HOUR + MEETING_LENGTH + MINIMUM_GAP) {
      // There is time for a meeting at the start of the day.
      freeTime = { day, start: START_HOUR, end: START_HOUR + MEETING_LENGTH };
      return freeTime;
    } else {
      for (let slot of sortedBusySlots) {
        if (slot.start <= unavailableTime.end + MEETING_LENGTH + MINIMUM_GAP) {
          // The next busy slot begins during another one, or so soon after that we
          // can't fit a meeting between. Expand the unavailable time to encompass it.
          if (slot.end > unavailableTime.end) {
            unavailableTime.end = slot.end;
          }
        } else {
          // The next busy slot is more than an hour after the previous one ended. Valid solution.
          freeTime = {
            day,
            start: unavailableTime.end + MINIMUM_GAP,
            end: unavailableTime.end + MINIMUM_GAP + MEETING_LENGTH
          };
          return freeTime;
        }
      }
    }
    if (unavailableTime.end + MEETING_LENGTH + MINIMUM_GAP <= END_HOUR) {
      // There is time for a meeting after the last busy slot of the day.
      freeTime = {
        day,
        start: unavailableTime.end + MINIMUM_GAP,
        end: unavailableTime.end + MINIMUM_GAP + MEETING_LENGTH
      };
      return freeTime;
    }
  }
  return freeTime;
};

module.exports = {
  processInput
};
