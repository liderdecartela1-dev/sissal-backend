import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import "./App.css";

export default function App() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    fetch("https://sissal-backend.onrender.com/dados")
      .then(res => res.json())
      .then(data => setDados(data));
  }, []);

  if (!dados) {
    return <div style={{ padding: 40, fontSize: 20 }}>Carregando BI...</div>;
  }

  const COLORS = ["#4f46e5", "#06b6d4", "#f59e0b"];

  return (
    <div style={{ padding: 30, background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        📊 SisSal Dashboard Diretoria
      </h1>

      {/* CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>

        <div style={cardStyle}>
          <h3>Total Atendido</h3>
          <p>R$ {dados.totalAtendido.toLocaleString()}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Faturado</h3>
          <p>R$ {dados.totalFaturado.toLocaleString()}</p>
        </div>

        <div style={cardStyle}>
          <h3>Perda</h3>
          <p style={{ color: "#f87171" }}>R$ {dados.perda.toLocaleString()}</p>
        </div>

      </div>

      {/* GRÁFICOS */}
      <div style={{ display: "flex", gap: 30 }}>

        {/* CONVÊNIOS */}
        <div style={{ flex: 1 }}>
          <h3>Convênios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.convenios}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ESPECIALIDADES */}
        <div style={{ flex: 1 }}>
          <h3>Especialidades</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados.especialidades}
                dataKey="valor"
                nameKey="nome"
                outerRadius={120}
              >
                {dados.especialidades.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  background: "#1e293b",
  padding: 20,
  borderRadius: 12
};