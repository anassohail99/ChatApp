const moment = require("moment");

function formateMessage(userName, text) {
  return {
    userName,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formateMessage;
