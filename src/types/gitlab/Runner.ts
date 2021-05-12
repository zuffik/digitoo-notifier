export interface Runner {
  id: number;
  description: string;
  active: boolean;
  is_shared: boolean;
  tags: string[];
}
