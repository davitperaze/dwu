
import { Component, ChangeDetectionStrategy, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { Character } from './models/character.model';
import { TimelineEvent } from './models/timeline-event.model';
import { DoctorWhoService } from './services/doctor-who.service';

import { HeaderComponent } from './components/header/header.component';
import { CharacterCardComponent } from './components/character-card/character-card.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { catchError, of } from 'rxjs';

type Category = 'doctors' | 'friends' | 'enemies' | 'timeline';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, CharacterCardComponent, TimelineComponent],
})
export class AppComponent implements OnInit {
  doctorWhoService = inject(DoctorWhoService);
  location = inject(Location);

  activeCategory = signal<Category>('doctors');
  isLoading = signal<boolean>(true);
  loadingError = signal<string | null>(null);

  // Data signals are now sourced from the service
  doctors = this.doctorWhoService.doctors;
  friends = this.doctorWhoService.friends;
  enemies = this.doctorWhoService.enemies;
  timelineEvents = this.doctorWhoService.timelineEvents;

  // State for Character Fun Fact Modal
  selectedCharacter = signal<Character | null>(null);
  funFact = signal<string>('');
  
  // State for Timeline Event Detail Modal
  selectedTimelineEvent = signal<TimelineEvent | null>(null);

  ngOnInit() {
    // Set initial category from URL on load
    const path = this.location.path().substring(1);
    if (path === 'doctors' || path === 'friends' || path === 'enemies' || path === 'timeline') {
      this.activeCategory.set(path as Category);
    } else {
      // This handles the case of an empty or invalid path.
      // It sets the URL to match the default active category without adding a new history entry.
      this.location.replaceState(`/${this.activeCategory()}`);
    }

    // Listen for back/forward navigation to update the active tab
    this.location.onUrlChange(path => {
      const category = path.substring(1) as Category;
      if (['doctors', 'friends', 'enemies', 'timeline'].includes(category)) {
        this.activeCategory.set(category);
      }
    });

    this.doctorWhoService.loadAllData().pipe(
      catchError(err => {
        console.error('Failed to load application data', err);
        this.loadingError.set('Failed to load data from the TARDIS archives. Please try refreshing the page.');
        return of(null);
      })
    ).subscribe(() => {
      this.isLoading.set(false);
    });
  }

  characters = computed(() => {
    switch (this.activeCategory()) {
      case 'doctors':
        return this.doctors();
      case 'friends':
        return this.friends();
      case 'enemies':
        return this.enemies();
      default:
        return [];
    }
  });

  setActiveCategory(category: Category) {
    this.activeCategory.set(category);
    this.location.go(`/${category}`);
  }

  handleGetFunFact(character: Character) {
    this.selectedCharacter.set(character);
    const fact = this.doctorWhoService.getFunFact(character.id);
    this.funFact.set(fact);
  }

  closeFunFactModal() {
    this.selectedCharacter.set(null);
    this.funFact.set('');
  }
}
