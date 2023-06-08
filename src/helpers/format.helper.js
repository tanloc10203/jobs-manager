"use strict";

const { format } = require("date-fns");

exports.formatTimeMoongoes = (date) => {
  const myDate = new Date(date);
  
  const formattedDate = format(myDate, 'dd/MM/yyyy HH:mm:ss');

  return formattedDate;
};
