import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input()
  public card!: Card;

  @Output()
  public likeClick: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() { }
}
