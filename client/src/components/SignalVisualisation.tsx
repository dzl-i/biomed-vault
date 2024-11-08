import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const SignalVisualization = ({ dataPoints }: { dataPoints: string }) => {
  // Parse the data points from JSON string
  const chartData = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return JSON.parse(dataPoints).map((point: any) => ({
        time: point.time,
        value: point.value
      }));
    } catch (error) {
      console.error('Error parsing signal data:', error);
      return [];
    }
  }, [dataPoints]);

  if (chartData.length === 0) {
    return (
      <p className="text-foreground-600">No signal data available for visualisation</p>
    );
  }

  return (

    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time (ms)', position: 'bottom' }}
          />
          <YAxis
            label={{ value: 'Value', angle: -90, position: 'left' }}
          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="value"
            stroke="#2563eb"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
