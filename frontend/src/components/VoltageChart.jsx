import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function VoltageChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#334155" />
        <XAxis dataKey="time" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="voltage"
          stroke="#06B6D4"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default VoltageChart;