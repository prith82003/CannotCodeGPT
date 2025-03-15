import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FFC989", "#f7c5bc", "#fda9c3", "#F49595", "F1CEBE"];

const InvestmentAnalysis = ({ balance, investments, prices }) => {
  if (!prices) return <p>Loading investment data...</p>;

  // Ensure prices are valid to prevent incorrect values when investments are sold
  const validPrices = prices || {};

  // Calculate the current value of all investments
  const investmentData = investments.map((inv) => ({
    name: inv.asset,
    value: parseFloat((inv.units * (validPrices[inv.asset.toLowerCase()] || 0)).toFixed(2)), // Cap to 2 decimal places
  }));

  // Add Remaining Balance to the Pie Chart
  const totalData = [
    ...investmentData,
    { name: "Remaining Balance", value: parseFloat(balance.toFixed(2)) }, // Cap to 2 decimal places
  ];

  return (
    <div className="p-6 bg-white shadow-md rounded-lg" style={{ minHeight: "500px" }}>
      <h2 className="text-xl font-bold text-center mb-4 text-gray-800 bg-transparent">Investment Breakdown</h2>

      <PieChart width={450} height={450}>
        <Pie
          data={totalData}
          cx="50%"
          cy="51.5%"
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={14}
              >
                {value.toFixed(2)}
              </text>
            );
          }}
          labelLine={false}
        >
          {totalData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
        <Legend />
      </PieChart>

      <p className="text-center font-semibold mt-4 text-gray-800">
        Total Value: ${totalData.reduce((acc, item) => acc + item.value, 0).toFixed(2)}
      </p>
    </div>
  );
};

export default InvestmentAnalysis;