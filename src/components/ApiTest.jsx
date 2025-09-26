import { useState, useEffect } from 'react';
import { healthCheck, getAllPGs } from '../utils/api';

const ApiTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [pgs, setPGs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        
        // Test health endpoint
        const healthResponse = await healthCheck();
        setHealthStatus(healthResponse.data);
        
        // Test PGs endpoint
        const pgsResponse = await getAllPGs({ limit: 5 });
        setPGs(pgsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p>Testing API connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h3 className="font-bold text-red-700">API Connection Error</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure the backend is running on http://127.0.0.1:5001/pg-walebhaiya/us-central1/api
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h3 className="font-bold text-green-700 mb-2">✅ API Connection Successful</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Health Status:</h4>
        <pre className="text-sm bg-white p-2 rounded">
          {JSON.stringify(healthStatus, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">PGs Data:</h4>
        <pre className="text-sm bg-white p-2 rounded max-h-32 overflow-y-auto">
          {JSON.stringify(pgs, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApiTest;
