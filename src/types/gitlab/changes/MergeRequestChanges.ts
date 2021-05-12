export interface MergeRequestChanges {
  state_id: number;
  updated_at: string;
  merge_status: 'preparing' | 'unchecked';
  title: string;
}
