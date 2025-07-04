import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TokenUsage } from '../../types';
import { format, parseISO } from 'date-fns';

interface TokenUsageChartProps {
  data: TokenUsage[];
  type: 'line' | 'area';
  showPrediction?: boolean;
}

export default function TokenUsageChart({ data, type, showPrediction = false }: TokenUsageChartProps) {
  const chartData = data.map(item => ({
    ...item,
    date: format(parseISO(item.date), 'dd/MM'),
    tokens: item.tokensUsed,
    efficiency: Math.round((item.tokensUsed / item.messagesCount) * 100) / 100
  }));

  // Add prediction data if enabled
  if (showPrediction && chartData.length > 0) {
    const lastDay = chartData[chartData.length - 1];
    const avgGrowth = chartData.length > 7 ? 
      (lastDay.tokens - chartData[chartData.length - 7].tokens) / 7 : 0;
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      chartData.push({
        ...lastDay,
        date: format(futureDate, 'dd/MM'),
        tokens: Math.max(0, lastDay.tokens + (avgGrowth * i)),
        tokensUsed: Math.max(0, lastDay.tokensUsed + (avgGrowth * i)),
        isPrediction: true
      });
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl">
          <p className="text-gray-300 text-sm font-medium mb-2">{`Data: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-cyan-400 font-semibold">
              {`Tokens: ${payload[0].value?.toLocaleString()}`}
              {data.isPrediction && <span className="text-xs text-gray-400 ml-1">(previsão)</span>}
            </p>
            {!data.isPrediction && (
              <>
                <p className="text-blue-400 text-sm">
                  {`Mensagens: ${data.messagesCount}`}
                </p>
                <p className="text-green-400 text-sm">
                  {`Média: ${data.averageTokensPerMessage} tokens/msg`}
                </p>
                <p className="text-purple-400 text-sm">
                  {`Pico: ${data.peakHour}h`}
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="tokens"
            stroke="#22D3EE"
            strokeWidth={2}
            fill="url(#tokenGradient)"
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

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
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="tokens" 
          stroke="#22D3EE" 
          strokeWidth={2}
          dot={(props) => {
            const { payload } = props;
            return (
              <circle
                {...props}
                fill={payload?.isPrediction ? "#F59E0B" : "#22D3EE"}
                stroke={payload?.isPrediction ? "#F59E0B" : "#22D3EE"}
                strokeWidth={2}
                r={payload?.isPrediction ? 3 : 4}
                strokeDasharray={payload?.isPrediction ? "3,3" : "none"}
              />
            );
          }}
          strokeDasharray={(props: any) => {
            // This is a workaround - in practice, you'd split the data
            return undefined;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}