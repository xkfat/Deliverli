import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DeliveryChart = () => {
  const data = [
    { name: 'Lun', livraisons: 12, enCours: 5 },
    { name: 'Mar', livraisons: 19, enCours: 8 },
    { name: 'Mer', livraisons: 15, enCours: 6 },
    { name: 'Jeu', livraisons: 22, enCours: 10 },
    { name: 'Ven', livraisons: 28, enCours: 12 },
    { name: 'Sam', livraisons: 18, enCours: 7 },
    { name: 'Dim', livraisons: 14, enCours: 4 },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Activité de la semaine</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLivraisons" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEnCours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }} 
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="livraisons" 
            stroke="#3b82f6" 
            fill="url(#colorLivraisons)"
            name="Livrées"
          />
          <Area 
            type="monotone" 
            dataKey="enCours" 
            stroke="#10b981" 
            fill="url(#colorEnCours)"
            name="En cours"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeliveryChart;