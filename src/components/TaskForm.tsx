import React, { useState } from 'react';
import { MapPin, Clock, Bell, Flag, Type as TypeIcon, Repeat, Save } from 'lucide-react';
import type { Task, TaskType, Priority, NotificationTrigger } from '../types/task';

const taskTypes: TaskType[] = ['Work', 'Personal', 'Errands', 'Fitness', 'Travel', 'Custom'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];
const triggers: NotificationTrigger[] = ['Entry', 'Exit', 'Both'];

export default function TaskForm() {
  const [task, setTask] = useState<Partial<Task>>({
    radius: 100,
    type: 'Personal',
    priority: 'Medium',
    notificationTrigger: 'Entry',
  });
  const [locationInput, setLocationInput] = useState('');
  const [locationError, setLocationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle task creation
    console.log('Task created:', task);
  };

  const getCurrentLocation = () => {
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setTask({
          ...task,
          location: { latitude, longitude }
        });
        setLocationInput(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Please allow location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task name"
            value={task.name || ''}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
          />
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <TypeIcon className="inline-block w-4 h-4 mr-2" />
            Task Type
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={task.type}
            onChange={(e) => setTask({ ...task, type: e.target.value as TaskType })}
          >
            {taskTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline-block w-4 h-4 mr-2" />
            Location
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter address or coordinates"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Use Current
              </button>
            </div>
            {locationError && (
              <p className="text-red-500 text-sm">{locationError}</p>
            )}
            {task.location && (
              <p className="text-sm text-gray-600">
                Selected coordinates: {task.location.latitude.toFixed(6)}, {task.location.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trigger Radius ({task.radius}m)
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={task.radius}
            onChange={(e) => setTask({ ...task, radius: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Notification Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Bell className="inline-block w-4 h-4 mr-2" />
            Notification Trigger
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={task.notificationTrigger}
            onChange={(e) => setTask({ ...task, notificationTrigger: e.target.value as NotificationTrigger })}
          >
            {triggers.map(trigger => (
              <option key={trigger} value={trigger}>{trigger}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Flag className="inline-block w-4 h-4 mr-2" />
            Priority
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value as Priority })}
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        {/* Time Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="inline-block w-4 h-4 mr-2" />
            Time
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setTask({ ...task, time: new Date(e.target.value) })}
          />
        </div>

        {/* Repeat Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Repeat className="inline-block w-4 h-4 mr-2" />
            Repeat
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={task.repeat?.type || 'none'}
            onChange={(e) => setTask({ ...task, repeat: { type: e.target.value as Task['repeat']['type'] } })}
          >
            <option value="none">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add any additional notes..."
            value={task.notes || ''}
            onChange={(e) => setTask({ ...task, notes: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Save className="w-5 h-5" />
        Create Task
      </button>
    </form>
  );
}