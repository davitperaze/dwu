export type TimelineEventCategory = 'debut' | 'regeneration' | 'revival' | 'anniversary' | 'milestone';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  category: TimelineEventCategory;
}