import React, { useState } from 'react';

export default function MLPredictView() {
  const [logText, setLogText] = useState("");
  const [prediction, setPrediction] = useState<{ category: string; priority: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!logText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // In Vite, we'll configure /api to proxy to the Python backend on :8000
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: logText })
      });
      
      if (!response.ok) {
        throw new Error('Prediction request failed: ' + response.statusText);
      }
      
      const data = await response.json();
      setPrediction({ category: data.category, priority: data.priority });
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex max-w-4xl mx-auto flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Hospital LM</h1>
            <p className="text-gray-400">Predict category and priority from hospital logs using Machine Learning.</p>
          </div>
        </div>

        <div className="bg-[#121212] rounded-xl border border-[#272727] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Incident Log / Case Notes</h2>
          
          <textarea 
            className="w-full bg-[#181818] border border-[#272727] text-white rounded-lg p-4 min-h-[150px] mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Patient arriving with severe chest tightening and breathing difficulties..."
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
          />
          
          <button 
            onClick={handlePredict} 
            disabled={loading || !logText.trim()}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg py-2.5 px-6 text-sm font-bold transition-colors cursor-pointer"
          >
            {loading ? "Analyzing Models..." : "Predict Triage Priority"}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {prediction && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#181818] border border-[#272727] rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Predicted Category</h3>
                <p className="text-2xl font-bold text-white capitalize">{prediction.category}</p>
              </div>
              
              <div className="bg-[#181818] border border-[#272727] rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Predicted Priority</h3>
                <p className="text-2xl font-bold text-white capitalize">{prediction.priority}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
