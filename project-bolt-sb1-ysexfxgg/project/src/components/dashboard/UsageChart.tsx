import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Usage } from '../../types';
import { format, parseISO } from 'date-fns';

interface UsageChartProps {
  data: Usage[];
  type: 'line' | 'bar';
}

export default function UsageChart({ data, type }: UsageChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'dd/MM'),
    messages: item.messagesCount
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`Data: ${label}`}</p>
          <p className="text-cyan-400 font-medium">
            {`Mensagens: ${payload[0].value}`}
          </p>
          {payload[1] && (
            <p className="text-blue-400 font-medium">
              {`Tokens: ${payload[1].value}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="messages" 
            stroke="#22D3EE" 
            strokeWidth={2}
            dot={{ fill: '#22D3EE', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#22D3EE', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="tokensUsed" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="messages" 
          fill="#22D3EE"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}