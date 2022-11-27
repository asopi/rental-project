import { WalletService } from '../services/wallet.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
/**
 * The route guard where the user's permissions are checked before entering an authenticated view.
 *
 * The route is allowed to be entered when the `canActivate` method returns `true`, and not allowed when it returns `false`.
 */
@Injectable()
export class IsConnectedGuard implements CanActivate {
  constructor(private readonly walletService: WalletService) {}
  /**
   * Run before a view using this route guard is entered.
   * @param next Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
   * @param state Represents the state of the router at a moment in time.
   * @returns Whether or not the view is allowed to be entered.
   */
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.walletService.init();
  }
}
