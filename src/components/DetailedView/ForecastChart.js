import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { formatDate, convertTemperature, groupForecastByDay, getDailySummary } from '../../utils/helpers';

function ForecastChart({ forecastData, temperatureUnit }) {
  if (!forecastData || !forecastData.list) {
    return <div>No forecast data available</div>;
  }

  // Group data by day and get daily summaries
  const groupedData = groupForecastByDay(forecastData.list);
  const dailyData = Object.values(groupedData)
    .slice(0, 7) // Get 7 days
    .map(dayItems => {
      const summary = getDailySummary(dayItems);
      return {
        date: formatDate(summary.timestamp),
        maxTemp: Math.round(convertTemperature(summary.maxTemp, temperatureUnit)),
        minTemp: Math.round(convertTemperature(summary.minTemp, temperatureUnit)),
      };
    });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const unit = temperatureUnit === 'celsius' ? '°C' : '°F';
      return (
        <div style={{
          background: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: '5px 0', color: '#ff6b6b' }}>
            High: {payload[0].value}{unit}
          </p>
          <p style={{ margin: '5px 0', color: '#4dabf7' }}>
            Low: {payload[1].value}{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={dailyData}>
        <defs>
          <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4dabf7" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: temperatureUnit === 'celsius' ? '°C' : '°F', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="maxTemp"
          stroke="#ff6b6b"
          fillOpacity={1}
          fill="url(#colorMax)"
          name="High Temperature"
        />
        <Area
          type="monotone"
          dataKey="minTemp"
          stroke="#4dabf7"
          fillOpacity={1}
          fill="url(#colorMin)"
          name="Low Temperature"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ForecastChart;
