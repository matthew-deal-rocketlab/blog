function dateToSeconds(dateString: Date): number {
  // Convert the date string to a Date object
  const dateObj = new Date(dateString)

  // Get the number of milliseconds since the Unix epoch (January 1, 1970)
  const milliseconds = dateObj.getTime()

  // Convert milliseconds to seconds by dividing by 1000
  const seconds = Math.floor(milliseconds / 1000)

  return seconds
}

export default dateToSeconds

// Example usage:
/* const dateStr = '2023-08-03T06:58:59.240Z';
  const seconds = dateToSeconds(dateStr);
  console.log(seconds);
  */
