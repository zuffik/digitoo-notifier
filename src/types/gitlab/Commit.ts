import { User } from './User';

export interface Commit {
  id: string;
  message: string;
  title: string;
  timestamp: string;
  url: string;
  author: User;
  added: string[];
  modified: string[];
  removed: string[];
}
