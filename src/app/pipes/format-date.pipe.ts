import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: number): string {
    if (value != null && value != 0) {
      console.log('value', value);

      return new Date(value * 1000).toLocaleDateString();
    } else {
      return '';
    }
  }
}
