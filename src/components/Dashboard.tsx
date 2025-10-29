import React from 'react';
import { Users, ListChecks, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Student, HasilAHP } from '../types';

interface DashboardProps {
  students: Student[];
  hasilAHP: HasilAHP[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, hasilAHP }) => {
  const stats = [
    {
      label: 'Total Siswa',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Siswa Dinilai',
      value: hasilAHP.length,
      icon: ListChecks,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Rekomendasi',
      value: hasilAHP.length,
      icon: Trophy,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      label: 'Akurasi',
      value: '95%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const topStudents = [...hasilAHP]
    .sort((a, b) => b.skorAkhir - a.skorAkhir)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Sistem Pendukung Keputusan dengan Metode AHP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-full p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Siswa</h2>
          <div className="space-y-3">
            {topStudents.length > 0 ? (
              topStudents.map((hasil, index) => (
                <div key={hasil.siswaId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{hasil.namaSiswa}</p>
                      <p className="text-sm text-gray-500">{hasil.rekomendasiBakat}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-600">{(hasil.skorAkhir * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada penilaian</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-4">Tentang Metode AHP</h2>
          <div className="space-y-3">
            <p className="text-indigo-100">
              Analytic Hierarchy Process (AHP) adalah metode pengambilan keputusan yang dikembangkan oleh Thomas L. Saaty.
            </p>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Langkah-langkah AHP:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-indigo-100">
                <li>Mendefinisikan kriteria penilaian</li>
                <li>Melakukan perbandingan berpasangan</li>
                <li>Menghitung bobot kriteria</li>
                <li>Penilaian alternatif (siswa)</li>
                <li>Menghasilkan rekomendasi</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
