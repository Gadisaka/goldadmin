"use client";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function VouchersPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");

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
                  <td className="p-3 font-mono">{v.code}</td>
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
