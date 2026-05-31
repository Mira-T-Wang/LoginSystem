import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SalesGraph({ graphData }) {
 const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString("en-US", {
    timeZone: "Asia/Yangon",
    month: "short",
    day: "numeric",
  });
};

  const formatRevenue = (value) => `$${value.toFixed(2)}`;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="graph-tooltip">
  <p className="graph-tooltip-date">
    {new Date(label + "T00:00:00Z").toLocaleDateString("en-US", {
      timeZone: "Asia/Yangon",
      weekday: "short",
      month: "short",
      day: "numeric",
    })}
  </p>
  <p className="graph-tooltip-value">
    Revenue: ${payload[0].value.toFixed(2)}
  </p>
</div>
      );
    }
    return null;
  };

  return (
    <div className="graph-section">
      <div className="graph-header">
        <div>
          <h3 className="graph-title">Sales Overview</h3>
          <p className="graph-subtitle">Revenue for the last 7 days</p>
        </div>
      </div>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={graphData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(79, 70, 229, 0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "rgba(79, 70, 229, 0.2)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatRevenue}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#818cf8" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesGraph;