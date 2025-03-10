export type TaskType = 'Work' | 'Personal' | 'Errands' | 'Fitness' | 'Travel' | 'Custom';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type NotificationTrigger = 'Entry' | 'Exit' | 'Both';

export interface Location {
  address?: string;
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  location: Location;
  radius: number; // in meters
  notificationTrigger: NotificationTrigger;
  priority: Priority;
  notes?: string;
  time?: Date;
  repeat?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    days?: number[];
    customDays?: number;
    endDate?: Date;
  };
}