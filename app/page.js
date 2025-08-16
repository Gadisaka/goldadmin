"use client";

import { useState, useEffect } from "react";
import Layout from "./components/Layout";

export default function DashboardPage() {
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [created, setCreated] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(new Set());
  const [stats, setStats] = useState({
    total: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    claimed: 0,
    unclaimed: 0,
    totalValue: 0,
  });

  const loadStats = async () => {
    try {
      const res = await fetch("/api/vouchers?status=all", {
        cache: "no-store",
      });
      const data = await res.json();
      const vouchers = data.items || [];

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const daily = vouchers.filter(
        (v) => new Date(v.createdAt) >= today
      ).length;
      const weekly = vouchers.filter(
        (v) => new Date(v.createdAt) >= weekAgo
      ).length;
      const monthly = vouchers.filter(
        (v) => new Date(v.createdAt) >= monthAgo
      ).length;
      const claimed = vouchers.filter((v) => v.status === "claimed").length;
      const unclaimed = vouchers.filter((v) => v.status === "unclaimed").length;
      const totalValue = vouchers.reduce((sum, v) => sum + (v.amount || 0), 0);

      setStats({
        total: vouchers.length,
        daily,
        weekly,
        monthly,
        claimed,
        unclaimed,
        totalValue,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const createVoucher = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          quantity: Number(quantity),
        }),
      });
      const j = await res.json();
      setCreated(j.items || []);
      // Reload stats after creating vouchers
      setTimeout(loadStats, 500);
    } catch (error) {
      console.error("Failed to create vouchers:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes((prev) => new Set([...prev, code]));
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(code);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white  rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6 space-y-6 text-gray-700">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* Create Voucher Form */}
        <div className="bg-white  rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Create New Vouchers</h2>
          <form onSubmit={createVoucher} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birr
                </label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                "Create Vouchers"
              )}
            </button>
          </form>
        </div>

        {/* Recently Created Vouchers */}
        {created.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">
              Recently Created Vouchers
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left border-b">
                    <th className="p-3 font-medium text-gray-700">Code</th>
                    <th className="p-3 font-medium text-gray-700">Amount</th>
                    <th className="p-3 font-medium text-gray-700">Status</th>
                    <th className="p-3 font-medium text-gray-700">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {created.map((v) => (
                    <tr key={v._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-mono text-blue-600">
                        <div className="flex items-center space-x-2">
                          <span>{v.code}</span>
                          <button
                            onClick={() => copyToClipboard(v.code)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title={
                              copiedCodes.has(v.code) ? "Copied!" : "Copy code"
                            }
                          >
                            {copiedCodes.has(v.code) ? (
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 text-gray-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{v.amount} Birr</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {v.status || "unclaimed"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(v.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vouchers"
            value={stats.total}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            }
            color="bg-blue-100 text-blue-600"
            subtitle="All time"
          />
          <StatCard
            title="Daily Created"
            value={stats.daily}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-green-100 text-green-600"
            subtitle="Today"
          />
          <StatCard
            title="Weekly Created"
            value={stats.weekly}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            }
            color="bg-purple-100 text-purple-600"
            subtitle="Last 7 days"
          />
          <StatCard
            title="Monthly Created"
            value={stats.monthly}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            }
            color="bg-orange-100 text-orange-600"
            subtitle="Last 30 days"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Claimed Vouchers"
            value={stats.claimed}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-green-100 text-green-600"
            subtitle={`${
              stats.total > 0
                ? Math.round((stats.claimed / stats.total) * 100)
                : 0
            }% of total`}
          />
          <StatCard
            title="Unclaimed Vouchers"
            value={stats.unclaimed}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-yellow-100 text-yellow-600"
            subtitle={`${
              stats.total > 0
                ? Math.round((stats.unclaimed / stats.total) * 100)
                : 0
            }% of total`}
          />
          <StatCard
            title="Total Value"
            value={`${stats.totalValue.toLocaleString()} Birr`}
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092c.938-.177 1.791-.604 2.353-1.253a1 1 0 10-1.51-1.31c.163.187.452.377.843.504v-1.941a4.535 4.535 0 00-1.676-.662C11.398 10.234 11 9.99 11 8c0-.99-.398-1.765-1.324-2.246A4.535 4.535 0 008 5.092V4z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="bg-emerald-100 text-emerald-600"
            subtitle="Combined amount"
          />
        </div>
      </div>
    </Layout>
  );
}
