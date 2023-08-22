import { WorkDay } from "./workDay";
import { ExtraDaysAndHours } from "../models/extraTime.model";

export default (submitDate: Date, turnaroundHours: number): Date => {
  const workDay = new WorkDay();
  const calculator = new Calculator(submitDate, turnaroundHours, workDay);
  return calculator.calculate();
};

class Calculator {
  private submitDate: Date;
  private turnaroundTime: ExtraDaysAndHours;

  constructor(
    submitDate: Date,
    turnaroundHours: number,
    private workDay: WorkDay
  ) {
    this.validate(submitDate, turnaroundHours);
    this.submitDate = submitDate;
    this.turnaroundTime = this.getTurnaroundTime(turnaroundHours);
    this.setExtraTime();
  }

  public calculate = (): Date => {
    this.submitDate.setDate(
      this.submitDate.getDate() + this.turnaroundTime.days
    );
    this.isMoreThanAWorkDay()
      ? this.submitDate.setHours(this.workDay.start + this.turnaroundTime.hours)
      : this.submitDate.setHours(
          this.submitDate.getHours() + this.turnaroundTime.hours
        );
    return this.submitDate;
  };

  private validate = (date: Date, turnaroundHours: number): void => {
    if (this.isWeekend(date) || this.isOutsideOfWorkingHours(date)) {
      throw new Error("Invalid submit date");
    }
    if (turnaroundHours <= 0) throw new Error("Invalid turnaround time");
  };

  private getTurnaroundTime = (turnaroundHours: number): ExtraDaysAndHours => {
    return {
      days: Math.floor(turnaroundHours / this.workDay.hours),
      hours: turnaroundHours % this.workDay.hours,
    };
  };

  private setExtraTime = () => {
    if (this.isMoreThanAWorkDay()) {
      this.turnaroundTime.days++;
      this.turnaroundTime.hours =
        (this.submitDate.getHours() +
          this.turnaroundTime.hours -
          this.workDay.start) %
        this.workDay.hours;
    }
    if (this.includesWeekend()) {
      this.turnaroundTime.days +=
        Math.floor((this.submitDate.getDay() + this.turnaroundTime.days) / 5) *
        2;
    }
  };

  private isWeekend = (date: Date): boolean => {
    return date.getDay() === 6 || date.getDay() === 0;
  };

  private isOutsideOfWorkingHours = (date: Date): boolean => {
    return (
      date.getHours() < this.workDay.start || date.getHours() > this.workDay.end
    );
  };

  private isMoreThanAWorkDay = (): boolean => {
    return (
      this.submitDate.getHours() + this.turnaroundTime.hours >= this.workDay.end
    );
  };

  private includesWeekend = (): boolean => {
    return this.submitDate.getDay() + this.turnaroundTime.days > 5;
  };
}
