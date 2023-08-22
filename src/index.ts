import calculateDueDate from "./helpers/dueDateCalculator";
const submitDate = new Date(2023, 7, 18, 12);
const turnaround = 12;
let res = calculateDueDate(submitDate, turnaround);
console.log(
  `Issue submitted on ${submitDate.toLocaleDateString()} with ${turnaround} hour turnaround time will be resolved on ${res.toLocaleDateString()}`
);
