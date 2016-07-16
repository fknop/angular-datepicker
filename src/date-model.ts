export class DateModel {
    date: Date;
    day: number;
    selected: boolean;
    off: boolean;

    constructor ({ date, off, selected }: {
        date: Date,
        off: boolean,
        selected: boolean,
    }) {
        this.date = date;
        this.off = off;
        this.selected = selected;
        this.day = this.date.getDate();
    }

    // Clone value and set selected
    setSelected (value: boolean) {

        if (value !== this.selected) {
            return new DateModel({
                date: this.date,
                off: this.off,
                selected: value
            });
        }

        return this;
    }
}