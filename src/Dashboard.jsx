import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [data] = useState([
    { mes: "Jan", faturamento: 120000, glosa: 8000 },
    { mes: "Fev", faturamento: 140000, glosa: 12000 },
    { mes: "Mar", faturamento: 180000, glosa: 9000 },
    { mes: "Abr", faturamento: 210000, glosa: 15000 }
  ]);

  useEffect(() => {
    fetch("https://sissal-backend.onrender.com/health")
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: "offline" }));
  }, []);

  const faturamentoTotal = data.reduce((acc, i) => acc + i.faturamento, 0);
  const glosaTotal = data.reduce((acc, i) => acc + i.glosa, 0);
  const liquido = faturamentoTotal - glosaTotal;

  return (
    <div className="p-6 grid gap-6 bg-slate-950 min-h-screen text-white">
      <div className="text-2xl font-bold">
        SisSal BI • Painel Diretoria
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm opacity-70">Faturamento Total</p>
            <p className="text-2xl">R$ {faturamentoTotal.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm opacity-70">Glosas</p>
            <p className="text-2xl">R$ {glosaTotal.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm opacity-70">Líquido</p>
            <p className="text-2xl text-green-400">R$ {liquido.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 h-80">
            <p className="mb-2">Evolução do Faturamento</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="faturamento" stroke="#38bdf8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 h-80">
            <p className="mb-2">Glosas por Mês</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="glosa" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="mb-2">Status do Backend</p>
          <p className={health?.status === "healthy" ? "text-green-400" : "text-red-400"}>
            {health?.status || "carregando..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
