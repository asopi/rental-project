import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  /**
   * Transforms milliseconts to a date string in the local date format.
   *
   * @param value Contains a date represented in milliseconds.
   * @returns Date string in local date format.
   */
  transform(value: number): string {
    if (value != null && value != 0) {
      return new Date(value).toLocaleDateString();
    } else {
      return '';
    }
  }
}
