"use client";

import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
// import BasicReportGenerator from "./basic-report-generator";

const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 1800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 2600 },
  { name: "May", total: 2400 },
  { name: "Jun", total: 2800 },
];

const overviewData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
  },
  { title: "Expenses", value: "$12,345.00", change: "+4.75% from last month" },
  { title: "Profit Margin", value: "72.8%", change: "+2.3% from last month" },
  { title: "Active Projects", value: "12", change: "+2 from last month" },
];

const recentTransactions = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
  },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
  },
];

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Financial Reports & Insights
        </h2>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            <span className="mr-2">⬇️</span>
            Export
          </button>
        </div>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {["overview", "analytics", "reports", "insights"].map((tab) => (
            <button
              key={tab}
              className={`${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewData.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    {item.title}
                  </h3>
                  <span className="text-gray-400">📊</span>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-4">
              <h3 className="text-lg font-medium text-gray-900">
                Revenue Overview
              </h3>
              <div className="mt-6" style={{ height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500">
                You made 265 sales this month.
              </p>
              <div className="mt-6 space-y-8">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-green-600">
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "analytics" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
          <p className="mt-1 text-sm text-gray-500">
            Detailed financial analytics will be implemented here.
          </p>
          <p className="mt-4">
            This section will contain more detailed charts and analysis of
            financial data.
          </p>
        </div>
      )}
      {activeTab === "reports" && <BasicReportGenerator />}
      {activeTab === "insights" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Financial Insights
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            AI-powered insights and recommendations.
          </p>
          <div className="mt-4">
            <h4 className="font-medium text-gray-800">Insights</h4>
            <ul className="mt-2 space-y-2">
              <li>
                Consider reducing expenses in the marketing department to
                increase profit margins.
              </li>
              <li>
                Sales have increased by 15% in the last quarter; focus on
                maintaining this momentum.
              </li>
              <li>
                Diversify revenue streams by exploring new product lines based
                on customer feedback.
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-800">Recommendations</h4>
            <ul className="mt-2 space-y-2">
              <li>
                Review your pricing strategy; a slight increase could enhance
                revenue without affecting sales volume.
              </li>
              <li>
                Invest in customer retention programs to decrease churn and
                enhance lifetime value.
              </li>
              <li>
                Utilize data analytics to identify key market trends and adjust
                your strategy accordingly.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
