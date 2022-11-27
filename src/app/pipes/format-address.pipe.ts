import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAddress',
})
export class FormatAddressPipe implements PipeTransform {
  /**
   * Shortens an account address. The first 5 characters are merged with the last 3 characters.
   *
   * @param address Contains the address to be shortened.
   * @returns Shortened address with three dots in between.
   */
  transform(address: string): string {
    if (address != null) {
      const start = address.slice(0, 5);
      const end = address.slice(-4, address.length);
      return start + '...' + end;
    } else {
      return '';
    }
  }
}
