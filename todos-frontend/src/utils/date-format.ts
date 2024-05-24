export const formatDate = (date: Date) => {
  const today = new Date();

  // check if time is 11:59:59 PM
  if (
    date.getHours() === 23 &&
    date.getMinutes() === 59 &&
    date.getSeconds() === 59 &&
    date.getMilliseconds() === 999
  ) {
    // return the date without time

    if (isToday(date)) return "Today";
    else if (isTomorrow(date)) return "Tomorrow";
    else if (isYesterday(date)) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  /// check if the date is today
  if (isToday(date)) {
    // return the time with AM/PM
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  // check if tomorrow is the date

  if (isTomorrow(date)) {
    // return "Tomorrow + time AM/PM"
    return `Tomorrow ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}`;
  }

  // check if yesterday is the date
  if (isYesterday(date)) {
    // return "Yesterday + time AM/PM"
    return `Yesterday ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      
      hour12: true,
    })}`;
  }

  // check if time is less than 6 days
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
  if (date > sixDaysAgo) {
    // return the day of the week + time AM/PM
    return date.toLocaleTimeString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  // return the date with time AM/PM
  return date.toLocaleTimeString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isTomorrow = (date: Date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

const isYesterday = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};
