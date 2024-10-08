import { ObjectId } from "mongodb";

export interface IGenericObject {
  [key: string]: any;
}

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

// MONGO
export interface DBOption {
  _id: ObjectId;
  option_name: string;
  option_value: string | string[];
}

export interface DBUserSettings {
  _id?: string;
  known_books: string[];
  known_craftable_items: string[];
  options: {
    isSimplifiedView: boolean;
  };
  todos?: TodoItem[]; // Add this line
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
export interface DBCraftingItem {
  _id?: string; // Optional unique identifier for the crafting info
  item_id: string; // Unique identifier for the crafting item
  name: string; // Description of the crafting item
  crafting_info?: string;
}

