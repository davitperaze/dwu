export interface Character {
  id: number;
  name: string;
  type: 'Doctor' | 'Companion' | 'Enemy';
  era: string;
  description: string;
  imageUrl: string;
}
