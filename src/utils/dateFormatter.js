export const getDuration = (time) => {
  let sec = Math.floor(time / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  if (hrs > 0) {
    if (min === 0) {
      return `${hrs}H`;
    }
    return `${hrs}H ${min}M`;
  } else {
    if (min === 0) {
      return `${sec}S`;
    }
    if (sec === 0) {
      return `${min}M`;
    }
    return `${min}M ${sec}S`;
  }
};

export const getTimeFromDate = (date) => {
  const time24 = new Date(date).getHours();
  let minutes = new Date(date).getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const time12 = {
    time: "",
    append: "",
  };

  if (time24 >= 0 && time24 <= 23) {
    if (time24 < 12) {
      time12.time = time24;
      time12.append = "am";
    } else {
      time12.time = time24 % 12 || 12;
      time12.append = "pm";
    }
  }
  return `${time12.time}:${minutes} ${time12.append}`;
};

export const getFormatedTime = (date) => {
  const month = new Date(date).toDateString().substr(4, 3);
  const din = new Date(date).getDate();
  const year = new Date(date).getFullYear();
  return `${getTimeFromDate(date)} ${month} ${din}, ${year}`;
};
