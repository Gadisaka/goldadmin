"use client";

import Layout from "../components/Layout";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>

        <div className="bg-white border rounded p-6 space-y-4">
          <h2 className="text-lg font-medium">System Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Name
              </label>
              <input
                type="text"
                value="Gold Bingo Admin"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="text"
                value="1.0.0"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Database Status
              </label>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700">Connected</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded p-6 space-y-4">
          <h2 className="text-lg font-medium">Default Admin Account</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">
              Default credentials for first-time setup:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Phone:</span> 0911223344
              </div>
              <div>
                <span className="font-medium">Password:</span> 0911223344
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
