import { expect } from "chai";
import calculateDueDate from "../helpers/dueDateCalculator";
import { WorkDay } from "../helpers/workDay";

describe("Validate params", () => {
  it("throws error if submit date weekend", () => {
    expect(() => calculateDueDate(new Date(2023, 7, 19, 10), 3)).to.throw(
      "Invalid submit date"
    );
  });
  it("throws error if submit date is outside of working hours", () => {
    expect(() => calculateDueDate(new Date(2023, 7, 18, 19), 3)).to.throw(
      "Invalid submit date"
    );
  });
  it("throws error if turnaround time is invalid", () => {
    expect(() => calculateDueDate(new Date(2023, 7, 21, 9), 0)).to.throw(
      "Invalid turnaround time"
    );
    expect(() => calculateDueDate(new Date(2023, 7, 21, 9), -5)).to.throw(
      "Invalid turnaround time"
    );
  });
});

describe("Test WorkDay", () => {
  it("throws an error with invalid start and end times", () => {
    expect(() => new WorkDay(17, 9)).to.throw("Invalid start and end values");
  });

  it("returns valid work hours with one param", () => {
    const expected = new WorkDay(8).hours;
    expect(expected).to.equal(9);
  });

  it("returns valid work hours with default params", () => {
    const expected = new WorkDay().hours;
    expect(expected).to.equal(8);
  });
});

describe("Test calculateDueDate", () => {
  it("returns a date", () => {
    let expected = calculateDueDate(new Date(), 3);
    expect(expected).to.be.a("Date");
  });

  it("returns simple resolved task on the same day", () => {
    let expected = calculateDueDate(new Date(2023, 7, 21, 9), 2);
    expect(expected).to.deep.equal(new Date(2023, 7, 21, 11));
  });

  it("returns resolved task on another day", () => {
    let expected = calculateDueDate(new Date(2023, 7, 15, 16), 2);
    expect(expected).to.deep.equal(new Date(2023, 7, 16, 10));
  });

  it("returns resolved task more than 2 days later", () => {
    let expected = calculateDueDate(new Date(2023, 7, 15, 14, 12), 18);
    expect(expected).to.deep.equal(new Date(2023, 7, 17, 16, 12));
  });

  it("returns resolved task weeks later", () => {
    let expected = calculateDueDate(new Date(2023, 7, 18, 10), 72);
    expect(expected).to.deep.equal(new Date(2023, 7, 31, 10));
  });

  it("returns resolved task with month change", () => {
    let expected = calculateDueDate(new Date(2023, 6, 31, 16), 10);
    expect(expected).to.deep.equal(new Date(2023, 7, 2, 10));
  });

  it("returns resolved task with year change", () => {
    let expected = calculateDueDate(new Date(2022, 11, 30, 16), 10);
    expect(expected).to.deep.equal(new Date(2023, 0, 3, 10));
  });
});
