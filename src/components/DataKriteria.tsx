import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Kriteria } from '../types';
import { calculateAHP, scaleMapping } from '../utils/ahpCalculations';

interface DataKriteriaProps {
  kriteria: Kriteria[];
  onAddKriteria: (kriteria: Omit<Kriteria, 'id'>) => void;
  onUpdateKriteria: (id: string, kriteria: Partial<Kriteria>) => void;
  onDeleteKriteria: (id: string) => void;
  onCalculateWeights: (weights: number[]) => void;
}

const DataKriteria: React.FC<DataKriteriaProps> = ({
  kriteria,
  onAddKriteria,
  onUpdateKriteria,
  onDeleteKriteria,
  onCalculateWeights
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAHPModal, setShowAHPModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', deskripsi: '' });
  const [pairwiseMatrix, setPairwiseMatrix] = useState<number[][]>([]);
  const [weights, setWeights] = useState<number[]>([]);
  const [consistencyRatio, setConsistencyRatio] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddKriteria(formData);
    setFormData({ nama: '', deskripsi: '' });
    setShowModal(false);
  };

  const initializePairwiseMatrix = () => {
    const n = kriteria.length;
    const matrix = Array(n).fill(0).map(() => Array(n).fill(1));
    setPairwiseMatrix(matrix);
    setShowAHPModal(true);
  };

  const updatePairwiseValue = (i: number, j: number, value: number) => {
    const newMatrix = [...pairwiseMatrix];
    newMatrix[i][j] = value;
    newMatrix[j][i] = 1 / value;
    setPairwiseMatrix(newMatrix);
  };

  const calculateWeights = () => {
    const result = calculateAHP(pairwiseMatrix, kriteria.map(k => k.nama));
    setWeights(result.weights);
    setConsistencyRatio(result.consistencyRatio);
    onCalculateWeights(result.weights);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kriteria Penilaian</h1>
          <p className="text-gray-600 mt-1">Kelola kriteria untuk penilaian bakat siswa</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Kriteria</span>
          </motion.button>
          {kriteria.length >= 2 && (
            <motion.button
              onClick={initializePairwiseMatrix}
              className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info className="w-5 h-5" />
              <span>Hitung Bobot AHP</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kriteria.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.nama}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.deskripsi}</p>
              </div>
              <button
                onClick={() => onDeleteKriteria(item.id)}
                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {item.bobot !== undefined && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bobot:</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {(item.bobot * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.bobot * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Kriteria</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kriteria</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Tambah
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showAHPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 my-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perbandingan Berpasangan AHP</h2>
            
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Petunjuk:</strong> Bandingkan setiap pasangan kriteria. Nilai 1 = sama penting, 9 = ekstrim lebih penting.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {kriteria.map((k1, i) =>
                kriteria.slice(i + 1).map((k2, j) => {
                  const actualJ = i + j + 1;
                  return (
                    <div key={`${i}-${actualJ}`} className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="font-bold text-indigo-600">{k1.nama}</span> dibanding{' '}
                        <span className="font-bold text-purple-600">{k2.nama}</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="1"
                          max="9"
                          step="1"
                          value={pairwiseMatrix[i]?.[actualJ] || 1}
                          onChange={(e) => updatePairwiseValue(i, actualJ, parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-lg font-bold text-indigo-600 min-w-[40px] text-right">
                          {pairwiseMatrix[i]?.[actualJ] || 1}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {scaleMapping[pairwiseMatrix[i]?.[actualJ] || 1]}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAHPModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={calculateWeights}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Hitung Bobot
              </button>
            </div>

            {weights.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">Hasil Perhitungan:</h3>
                <div className="space-y-2">
                  {kriteria.map((k, i) => (
                    <div key={k.id} className="flex justify-between items-center">
                      <span className="text-gray-700">{k.nama}</span>
                      <span className="font-bold text-green-700">{(weights[i] * 100).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-green-300">
                  <p className="text-sm text-gray-700">
                    Consistency Ratio: <span className={`font-bold ${consistencyRatio < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                      {consistencyRatio.toFixed(4)}
                    </span>
                    {consistencyRatio < 0.1 ? ' (Konsisten ✓)' : ' (Tidak Konsisten ✗)'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DataKriteria;
