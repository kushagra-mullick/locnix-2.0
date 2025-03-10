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

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setLocationInput(input);

    // Try to parse coordinates from input (format: "latitude, longitude")
    const coords = input.split(',').map(coord => parseFloat(coord.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      setTask({
        ...task,
        location: {
          latitude: coords[0],
          longitude: coords[1]
        }
      });
      setLocationError('');
    } else {
      // Clear location from task if input is invalid
      const newTask = { ...task };
      delete newTask.location;
      setTask(newTask);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!task.name?.trim()) {
      alert('Please enter a task name');
      return;
    }

    if (!task.location) {
      alert('Please enter a valid location (latitude, longitude)');
      return;
    }

    // Generate a unique ID for the task
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: task.name,
      type: task.type || 'Personal',
      location: task.location,
      radius: task.radius || 100,
      notificationTrigger: task.notificationTrigger || 'Entry',
      priority: task.priority || 'Medium',
      notes: task.notes,
      time: task.time,
      repeat: task.repeat
    };

    console.log('Task created:', newTask);
    
    // Reset form
    setTask({
      radius: 100,
      type: 'Personal',
      priority: 'Medium',
      notificationTrigger: 'Entry',
    });
    setLocationInput('');
    alert('Task created successfully!');
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
            required
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
            required
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
                placeholder="Enter coordinates (e.g., 51.5074, -0.1278)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={locationInput}
                onChange={handleLocationInput}
                required
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
            required
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
            required
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