function compareTime(timeStr1, timeStr2) {
  let date1 = new Date(timeStr1);
  let date2 = new Date(timeStr2);

  return date1.getTime() > date2.getTime();
}

module.exports = {
  compareTime,
};
