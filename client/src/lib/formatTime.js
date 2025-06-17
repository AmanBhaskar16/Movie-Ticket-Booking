const formatTime = (mins) =>{
  const hrs = Math.floor(mins/60);
  const rem = mins%60;
  return `${hrs}h ${rem}m`
}

export default formatTime;