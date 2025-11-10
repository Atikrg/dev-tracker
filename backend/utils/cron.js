// cron/jobs.js
const cron = require("node-cron");

const scheduleTasks = () => {
  console.log("Cron Scheduler Started");
  cron.schedule(
    "0 7,9,13,19 * * *",
    () => {
      console.log("Running task at 7AM, 9AM, 1PM, and 7PM (IST)");
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};

module.exports = scheduleTasks;
