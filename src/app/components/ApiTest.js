'use client';

import React, { useState } from 'react';
import { questionsAPI, authAPI } from '../utils/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (testName, apiCall) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
    }
    setLoading(false);
  };

  const tests = [
    {
      name: 'Get Questions',
      action: () => testEndpoint('questions', () => questionsAPI.getQuestions())
    },
    {
      name: 'Get Questions (SD Level)',
      action: () => testEndpoint('questionsd', () => questionsAPI.getQuestions('sd'))
    },
    {
      name: 'Test Register',
      action: () => testEndpoint('register', () => authAPI.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        level: 'sd'
      }))
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">API Connection Test</h2>
        
        <div className="grid gap-4 mb-6">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <span className="font-medium">{test.name}</span>
              <button
                onClick={test.action}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test'}
              </button>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="p-4 rounded-lg border">
              <h3 className="font-bold mb-2 capitalize">{testName}</h3>
              {result.success ? (
                <div className="text-green-600">
                  <p className="font-medium">✅ Success!</p>
                  <pre className="text-sm bg-green-50 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-red-600">
                  <p className="font-medium">❌ Error:</p>
                  <p className="text-sm bg-red-50 p-2 rounded mt-2">{result.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Manual Test */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Quick Manual Test</h3>
          <p className="text-sm text-gray-600 mb-3">
            Klik tombol di bawah untuk test koneksi langsung ke API:
          </p>
          <button
            onClick={() => {
              fetch('https://gis-backend.karyavisual.com/api/exam/questions')
                .then(res => res.json())
                .then(data => {
                  alert('Direct API call success! Check console for data.');
                  console.log('Direct API Response:', data);
                })
                .catch(err => {
                  alert('Direct API call failed: ' + err.message);
                  console.error('Direct API Error:', err);
                });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test Direct API Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
