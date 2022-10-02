import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAddress'
})
export class FormatAddressPipe implements PipeTransform {

  transform(address: string): string {
    if (address != null) {
      const start = address.slice(0, 5);
      const end = address.slice(-4, address.length);
      return start + '...' + end;
    }
    else {
      return '';
    }

  }

}
