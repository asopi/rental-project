import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: number): string {
    if (value != null && value != 0) {
      return new Date(value).toLocaleDateString();
    } else {
      return '';
    }
  }
}
