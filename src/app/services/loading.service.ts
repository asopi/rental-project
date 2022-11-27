import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Emits the next loading state used while waiting for a response.
   *
   * @param state Contains the information about the loading state.
   */
  public setLoading(state: boolean): void {
    this.loading$.next(state);
  }
}
