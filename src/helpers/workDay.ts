export class WorkDay {
  private _start = 9;
  private _end = 17;
  private _hours: number;

  constructor(start?: number, end?: number) {
    if (start) this._start = start;
    if (end) this._end = end;
    this._hours = this.calculateHours();
  }

  public get start() {
    return this._start;
  }

  public get end() {
    return this._end;
  }

  public get hours() {
    return this._hours;
  }

  private calculateHours = () => {
    if (this.end <= this.start) {
      throw new Error("Invalid start and end values");
    }
    return this._end - this.start;
  };
}
