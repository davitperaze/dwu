import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  data = input.required<HeroData>();
}