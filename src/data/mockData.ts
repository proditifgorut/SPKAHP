import { Student, Kriteria } from '../types';

export const defaultKriteria: Kriteria[] = [
  {
    id: '1',
    nama: 'Kemampuan Matematika',
    deskripsi: 'Kemampuan dalam logika dan pemecahan masalah matematis'
  },
  {
    id: '2',
    nama: 'Kemampuan Verbal',
    deskripsi: 'Kemampuan komunikasi dan berbahasa'
  },
  {
    id: '3',
    nama: 'Kreativitas',
    deskripsi: 'Kemampuan berpikir kreatif dan inovatif'
  },
  {
    id: '4',
    nama: 'Kepemimpinan',
    deskripsi: 'Kemampuan memimpin dan mengorganisir'
  },
  {
    id: '5',
    nama: 'Kemampuan Sosial',
    deskripsi: 'Kemampuan berinteraksi dan berempati'
  }
];

export const sampleStudents: Student[] = [
  {
    id: '1',
    nama: 'Ahmad Zaki',
    kelas: '10 IPA 1',
    nisn: '0012345678',
    email: 'ahmad.zaki@email.com',
    tanggalLahir: '2008-05-15'
  },
  {
    id: '2',
    nama: 'Siti Nurhaliza',
    kelas: '10 IPA 1',
    nisn: '0012345679',
    email: 'siti.nur@email.com',
    tanggalLahir: '2008-07-20'
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    kelas: '10 IPS 1',
    nisn: '0012345680',
    email: 'budi.s@email.com',
    tanggalLahir: '2008-03-10'
  }
];
