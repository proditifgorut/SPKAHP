import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataSiswa from './components/DataSiswa';
import DataKriteria from './components/DataKriteria';
import Penilaian from './components/Penilaian';
import HasilRekomendasi from './components/HasilRekomendasi';
import { NavigationPage, Student, Kriteria, NilaiSiswa, HasilAHP } from './types';
import { defaultKriteria, sampleStudents } from './data/mockData';
import { getTalentRecommendation } from './utils/ahpCalculations';

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [kriteria, setKriteria] = useState<Kriteria[]>(defaultKriteria);
  const [nilaiSiswa, setNilaiSiswa] = useState<NilaiSiswa[]>([]);
  const [hasilAHP, setHasilAHP] = useState<HasilAHP[]>([]);

  useEffect(() => {
    calculateAHPResults();
  }, [nilaiSiswa, kriteria]);

  const calculateAHPResults = () => {
    const studentIds = [...new Set(nilaiSiswa.map(n => n.siswaId))];
    
    const results: HasilAHP[] = studentIds.map(siswaId => {
      const student = students.find(s => s.id === siswaId);
      if (!student) return null;

      const detailKriteria = kriteria.map(k => {
        const nilai = nilaiSiswa.find(n => n.siswaId === siswaId && n.kriteriaId === k.id);
        const normalizedNilai = (nilai?.nilai || 0) / 100;
        const bobot = k.bobot || 0;
        const skorTerbobot = normalizedNilai * bobot;

        return {
          kriteriaId: k.id,
          namaKriteria: k.nama,
          nilai: nilai?.nilai || 0,
          bobot,
          skorTerbobot
        };
      });

      const skorAkhir = detailKriteria.reduce((sum, d) => sum + d.skorTerbobot, 0);
      const rekomendasiBakat = getTalentRecommendation(detailKriteria);

      return {
        siswaId,
        namaSiswa: student.nama,
        skorAkhir,
        rekomendasiBakat,
        detailKriteria
      };
    }).filter(Boolean) as HasilAHP[];

    setHasilAHP(results);
  };

  const handleAddStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updatedStudent } : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setNilaiSiswa(nilaiSiswa.filter(n => n.siswaId !== id));
  };

  const handleAddKriteria = (newKriteria: Omit<Kriteria, 'id'>) => {
    const kriteriaBaru: Kriteria = {
      ...newKriteria,
      id: Date.now().toString()
    };
    setKriteria([...kriteria, kriteriaBaru]);
  };

  const handleUpdateKriteria = (id: string, updatedKriteria: Partial<Kriteria>) => {
    setKriteria(kriteria.map(k => k.id === id ? { ...k, ...updatedKriteria } : k));
  };

  const handleDeleteKriteria = (id: string) => {
    setKriteria(kriteria.filter(k => k.id !== id));
    setNilaiSiswa(nilaiSiswa.filter(n => n.kriteriaId !== id));
  };

  const handleCalculateWeights = (weights: number[]) => {
    const updatedKriteria = kriteria.map((k, index) => ({
      ...k,
      bobot: weights[index]
    }));
    setKriteria(updatedKriteria);
  };

  const handleSaveNilai = (nilai: NilaiSiswa[]) => {
    const existingNilaiFiltered = nilaiSiswa.filter(
      n => !nilai.some(newN => newN.siswaId === n.siswaId && newN.kriteriaId === n.kriteriaId)
    );
    setNilaiSiswa([...existingNilaiFiltered, ...nilai]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard students={students} hasilAHP={hasilAHP} />;
      case 'siswa':
        return (
          <DataSiswa
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        );
      case 'kriteria':
        return (
          <DataKriteria
            kriteria={kriteria}
            onAddKriteria={handleAddKriteria}
            onUpdateKriteria={handleUpdateKriteria}
            onDeleteKriteria={handleDeleteKriteria}
            onCalculateWeights={handleCalculateWeights}
          />
        );
      case 'penilaian':
        return (
          <Penilaian
            students={students}
            kriteria={kriteria}
            onSaveNilai={handleSaveNilai}
          />
        );
      case 'hasil':
        return <HasilRekomendasi hasilAHP={hasilAHP} />;
      default:
        return <Dashboard students={students} hasilAHP={hasilAHP} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 p-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
