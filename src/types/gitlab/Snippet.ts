export interface Snippet {
  id: number;
  title: string;
  content: string;
  author_id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  file_name: string;
  expires_at?: string;
  type: string;
  visibility_level: number;
}
