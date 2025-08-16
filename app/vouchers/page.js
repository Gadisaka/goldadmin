"use client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function VouchersPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [copiedCodes, setCopiedCodes] = useState(new Set());
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCodes((prev) => new Set([...prev, code]));
  };
  const load = async () => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await fetch("/api/vouchers?" + params.toString(), {
      cache: "no-store",
    });
    const j = await res.json();
    setItems(j.items || []);
  };

  useEffect(() => {
    load();
  }, [status]);

  return (
    <Layout>
      <div className="p-6 space-y-4 text-gray-700">
        <h1 className="text-2xl font-semibold">Vouchers</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="unclaimed">Unclaimed</option>
          <option value="claimed">Claimed</option>
        </select>
        <div className="bg-white border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left border-b">
                <th className="p-3">Code</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Claimed</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
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
                  <td className="p-3">{v.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        v.status === "claimed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(v.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {v.claimedAt ? new Date(v.claimedAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
