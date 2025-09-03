import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class CharacterCardComponent {
  character = input.required<Character>();
  priority = input<boolean>(false);
  getFunFact = output<Character>();

  onButtonClick() {
    this.getFunFact.emit(this.character());
  }
}