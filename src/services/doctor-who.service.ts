

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, tap } from 'rxjs';
import { Character } from '../models/character.model';
import { TimelineEvent } from '../models/timeline-event.model';
import { HeroData } from '../components/hero/hero.component';

type FunFactsData = Record<number, string[]>;

@Injectable({ providedIn: 'root' })
export class DoctorWhoService {
  private http = inject(HttpClient);

  doctors = signal<Character[]>([]);
  friends = signal<Character[]>([]);
  enemies = signal<Character[]>([]);
  timelineEvents = signal<TimelineEvent[]>([]);
  heroData = signal<Record<string, HeroData> | null>(null);
  private funFacts = signal<FunFactsData>({});

  loadAllData() {
    return forkJoin({
      doctors: this.http.get<Character[]>('assets/data/doctors.json'),
      friends: this.http.get<Character[]>('assets/data/friends.json'),
      enemies: this.http.get<Character[]>('assets/data/enemies.json'),
      timelineEvents: this.http.get<TimelineEvent[]>('assets/data/timeline-events.json'),
      funFacts: this.http.get<FunFactsData>('assets/data/fun-facts.json'),
      heroData: this.http.get<Record<string, HeroData>>('assets/data/hero-data.json'),
    }).pipe(
      tap(data => {
        this.doctors.set(data.doctors);
        this.friends.set(data.friends);
        this.enemies.set(data.enemies);
        this.timelineEvents.set(data.timelineEvents);
        this.heroData.set(data.heroData);
        this.funFacts.set(data.funFacts);
      })
    );
  }
  
  getFunFact(characterId: number): string {
    const facts = this.funFacts()[characterId];
    if (facts?.length) {
      // Return a random fact if multiple exist for one character
      return facts[Math.floor(Math.random() * facts.length)];
    }
    return "No fun fact available for this character. They're probably just that mysterious!";
  }
}