export const msToHHMMSS = ms => {
  const hh = String(Math.floor(ms / 3600000) + 100).substring(1);
  const mm = String(Math.floor((ms - hh * 3600000) / 60000) + 100).substring(1);
  const ss = String(
    Math.floor((ms - hh * 3600000 - mm * 60000) / 1000) + 100
  ).substring(1);
  return `${hh}:${mm}:${ss}`;
};

// export const
