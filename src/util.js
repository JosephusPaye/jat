const timeFactors = [
  1, // seconds in a second
  60, // seconds in a minute
  60 * 60, // seconds in an hour
  24 * 60 * 60 // seconds in a day
];

export function parseTime(timeString) {
  const parts = timeString
    .split(":") // split on color delimiter
    .map(part => Number(part.trim())) // trim parts and convert to number
    .reverse(); // Reverse for [seconds, minutes, ...]

  const totalSeconds = parts
    .slice(0, 4) // working with only seconds, minutes, hours, and days
    .reduce((total, currentPart, index) => {
      return total + currentPart * timeFactors[index];
    }, 0);

  return totalSeconds * 1000;
}
