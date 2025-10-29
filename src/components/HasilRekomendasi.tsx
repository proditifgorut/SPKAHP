import React, { useState } from 'react';
import { Trophy, TrendingUp, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HasilAHP } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface HasilRekomendasiProps {
  hasilAHP: HasilAHP[];
}

const HasilRekomendasi: React.FC<HasilRekomendasiProps> = ({ hasilAHP }) => {
  const [selectedStudent, setSelectedStudent] = useState<HasilAHP | null>(null);

  const sortedResults = [...hasilAHP].sort((a, b) => b.skorAkhir - a.skorAkhir);

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-400';
    if (index === 2) return 'bg-orange-600';
    return 'bg-indigo-500';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  if (hasilAHP.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">Belum Ada Hasil Penilaian</h3>
        <p className="text-gray-500 mt-2">
          Silakan lakukan penilaian siswa terlebih dahulu di menu Penilaian AHP.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hasil & Rekomendasi</h1>
          <p className="text-gray-600 mt-1">Peringkat siswa berdasarkan analisis AHP</p>
        </div>
        <motion.button
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5" />
          <span>Unduh Laporan</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Peringkat Siswa</h2>
          <div className="space-y-3">
            {sortedResults.map((hasil, index) => (
              <motion.div
                key={hasil.siswaId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all cursor-pointer border border-gray-200"
                onClick={() => setSelectedStudent(hasil)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 ${getRankColor(index)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {getRankBadge(index)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{hasil.namaSiswa}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {hasil.rekomendasiBakat}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {(hasil.skorAkhir * 100).toFixed(1)}%
                  </div>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-1">
                    <Eye className="w-3 h-3 mr-1" />
                    Detail
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribusi Bakat</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedResults.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="namaSiswa" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="skorAkhir" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedStudent.namaSiswa}</h2>
                <p className="text-gray-600">Detail Analisis Bakat</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-90">Skor Akhir</p>
                  <p className="text-4xl font-bold mt-2">{(selectedStudent.skorAkhir * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-90">Rekomendasi Bakat</p>
                  <p className="text-2xl font-bold mt-2">{selectedStudent.rekomendasiBakat}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detail per Kriteria</h3>
                <div className="space-y-3">
                  {selectedStudent.detailKriteria.map((detail) => (
                    <div key={detail.kriteriaId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{detail.namaKriteria}</h4>
                          <p className="text-xs text-gray-500">Bobot: {(detail.bobot * 100).toFixed(2)}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{detail.nilai}</p>
                          <p className="text-xs text-gray-500">Skor: {detail.skorTerbobot.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${detail.nilai}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Visualisasi Radar</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={selectedStudent.detailKriteria}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="namaKriteria" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name={selectedStudent.namaSiswa} dataKey="nilai" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HasilRekomendasi;
