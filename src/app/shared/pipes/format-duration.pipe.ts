import { Pipe, PipeTransform } from '@angular/core';
import { PluralizePipe } from './pluralize.pipe';

@Pipe({
    name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {
    constructor(private pluralizePipe: PluralizePipe) { }

    transform(value: string | null | undefined, padWithZeros: boolean = true): string {
        if (!value) return '00:00';

        let days = 0;
        let timePart = value;

        if (value.includes('.')) {
            const parts = value.split('.');
            days = parseInt(parts[0], 10) || 0;
            timePart = parts[1]; // "HH:MM:SS"
        }

        const timeSegments = timePart.split(':').map(v => parseInt(v, 10));
        if (timeSegments.length !== 3) return '00:00';

        let [hours, minutes, seconds] = timeSegments;
        hours += days * 24;

        const displayHours = padWithZeros ? String(hours).padStart(2, '0') : String(hours);
        const displayMinutes = padWithZeros ? String(minutes).padStart(2, '0') : String(minutes);

        const hh = +displayHours > 0 ? this.pluralizePipe.transform(+displayHours, 'hour') : '';
        const mm = this.pluralizePipe.transform(+displayMinutes, 'minute');

        return `${hh} ${mm}`;
    }
}
