"use client";

import { useState } from "react";

export default function ApiTestPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testValidation = async (method) => {
    if (!code.trim()) {
      setResult({ error: "Please enter a voucher code" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;

      if (method === "POST") {
        // Test claiming a voucher
        response = await fetch("/api/vouchers/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code.trim() }),
        });
      } else {
        // Test validating a voucher (GET)
        response = await fetch(
          `/api/vouchers/validate?code=${encodeURIComponent(code.trim())}`
        );
      }

      const data = await response.json();
      setResult({ ...data, status: response.status });
    } catch (error) {
      setResult({ error: "Network error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Voucher API Test
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Test Voucher Validation
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voucher Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter voucher code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => testValidation("GET")}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Testing..." : "Validate (GET)"}
              </button>

              <button
                onClick={() => testValidation("POST")}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Claiming..." : "Claim (POST)"}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">API Response</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            API Usage Examples
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800">
                Validate Voucher (GET)
              </h4>
              <code className="block bg-blue-100 text-gray-700 p-2 rounded mt-1">
                GET /api/vouchers/validate?code=VOUCHER123
              </code>
              <p className="text-blue-700 mt-1">
                Use this to check if a voucher is valid without claiming it.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">
                Claim Voucher (POST)
              </h4>
              <code className="block bg-blue-100 text-gray-700 p-2 rounded mt-1">
                POST /api/vouchers/validate
                {"\n"}Content-Type: application/json
              </code>
              <p className="text-blue-700 mt-1">
                Use this to claim a voucher and update its status.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">Response Codes</h4>
              <ul className="text-blue-700 mt-1 space-y-1">
                <li>
                  <strong>200:</strong> Success (voucher validated or claimed)
                </li>
                <li>
                  <strong>400:</strong> Bad request (missing voucher code)
                </li>
                <li>
                  <strong>404:</strong> Voucher not found
                </li>
                <li>
                  <strong>409:</strong> Voucher already claimed
                </li>
                <li>
                  <strong>500:</strong> Server error
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
