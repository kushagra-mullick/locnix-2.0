import React from 'react';
import { MapPin } from 'lucide-react';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Locnix 2.0</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Task</h2>
          <p className="mt-2 text-gray-600">
            Set up your location-based task with AI-powered suggestions or manual control.
          </p>
        </div>

        <TaskForm />
      </main>
    </div>
  );
}

export default App;