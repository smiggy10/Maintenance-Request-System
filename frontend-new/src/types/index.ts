export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  created_by?: number;
  created_by_name?: string;
}
