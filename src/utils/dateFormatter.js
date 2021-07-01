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
