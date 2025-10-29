import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Student, Kriteria, NilaiSiswa } from '../types';

interface PenilaianProps {
  students: Student[];
  kriteria: Kriteria[];
  onSaveNilai: (nilai: NilaiSiswa[]) => void;
}

const Penilaian: React.FC<PenilaianProps> = ({ students, kriteria, onSaveNilai }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [nilaiData, setNilaiData] = useState<{ [kriteriaId: string]: number }>({});

  const handleNilaiChange = (kriteriaId: string, nilai: number) => {
    setNilaiData(prev => ({ ...prev, [kriteriaId]: nilai }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const nilaiArray: NilaiSiswa[] = Object.entries(nilaiData).map(([kriteriaId, nilai]) => ({
      siswaId: selectedStudent,
      kriteriaId,
      nilai
    }));

    onSaveNilai(nilaiArray);
    setNilaiData({});
    setSelectedStudent('');
  };

  if (kriteria.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Kriteria Belum Tersedia</h3>
            <p className="text-yellow-700 mt-1">
              Silakan tambahkan kriteria penilaian terlebih dahulu di menu Kriteria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!kriteria[0].bobot) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Bobot Kriteria Belum Dihitung</h3>
            <p className="text-yellow-700 mt-1">
              Silakan hitung bobot kriteria menggunakan metode AHP terlebih dahulu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Penilaian AHP</h1>
        <p className="text-gray-600 mt-1">Berikan nilai untuk setiap kriteria pada siswa</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Siswa</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">-- Pilih Siswa --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.nama} - {student.kelas}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b-2 border-indigo-200">
                Penilaian Kriteria
              </h3>

              {kriteria.map((k) => (
                <div key={k.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{k.nama}</h4>
                      <p className="text-sm text-gray-600">{k.deskripsi}</p>
                      <p className="text-xs text-indigo-600 mt-1">
                        Bobot: {((k.bobot || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Nilai (0-100):
                      </label>
                      <span className="text-2xl font-bold text-indigo-600 min-w-[60px] text-right">
                        {nilaiData[k.id] || 0}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={nilaiData[k.id] || 0}
                      onChange={(e) => handleNilaiChange(k.id, parseFloat(e.target.value))}
                      className="w-full"
                      required
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Kurang</span>
                      <span>Cukup</span>
                      <span>Baik</span>
                      <span>Sangat Baik</span>
                    </div>
                  </div>
                </div>
              ))}

              <motion.button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                <span>Simpan Penilaian</span>
              </motion.button>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Penilaian;
