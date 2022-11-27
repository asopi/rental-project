import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-identicon',
  templateUrl: './identicon.component.html',
  styleUrls: ['./identicon.component.scss'],
})
export class IdenticonComponent {
  @Input()
  public identity: string = '';

  @Input()
  public width: number = 36;

  @Input()
  public height: number = 36;
}
