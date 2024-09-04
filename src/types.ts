export type TrackableType = 'books' | 'craftableItems';

export interface TrackableItem {
  id: string;
  [key: string]: string;
}

export interface Book extends TrackableItem {
  Book: string;
  Aspect: string;
  Level: string;
  Memory: string;
  'Memory Aspects': string;
  Lesson: string;
  Lessons: string;
  'Lesson Aspects': string;
  Price: string;
  Language: string;
  Type: string;
  Period: string;
  Contaminated: string;
  Description: string;
}

export interface CraftableItem extends TrackableItem {
  Item: string;
  Aspect: string;
  Level: string;
  'Required Skill': string;
  'Extra Requirement': string;
  Result: string;
  'Result Aspects': string;
}