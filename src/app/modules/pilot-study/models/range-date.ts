export class DateRange {
    begin: any;
    end: any;

    constructor() {

    }

    getBegin(): any {
        return this.begin;
    }

    getEnd(): any {
        return this.end;
    }

    setBegin(date: any): void {
        this.begin = date;
    }

    setEnd(date: any): void {
        this.end = date;
    }
}
