import React, { useState } from 'react';
import { demoUsers } from '../data/demoUsers';

const DemoUsers: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowCredentials(!showCredentials)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg"
      >
        {showCredentials ? 'Hide Demo Users' : 'Show Demo Users'}
      </button>

      {showCredentials && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded-lg shadow-xl max-w-md overflow-auto max-h-96">
          <h3 className="text-lg font-bold mb-2">Demo User Credentials</h3>
          <p className="text-sm text-gray-600 mb-4">Use these credentials to test different user roles</p>
          
          <div className="space-y-4">
            {demoUsers.map((user) => (
              <div key={user.id} className="border p-3 rounded">
                <div className="font-semibold">{user.name} ({user.role})</div>
                <div className="text-sm">
                  <div>Email: {user.email}</div>
                  <div>Password: {user.password}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoUsers; 