export interface Student {
  id: string;
  nama: string;
  kelas: string;
  nisn: string;
  email: string;
  tanggalLahir: string;
}

export interface Kriteria {
  id: string;
  nama: string;
  deskripsi: string;
  bobot?: number;
}

export interface PairwiseComparison {
  kriteria1: string;
  kriteria2: string;
  nilai: number;
}

export interface NilaiSiswa {
  siswaId: string;
  kriteriaId: string;
  nilai: number;
}

export interface HasilAHP {
  siswaId: string;
  namaSiswa: string;
  skorAkhir: number;
  rekomendasiBakat: string;
  detailKriteria: {
    kriteriaId: string;
    namaKriteria: string;
    nilai: number;
    bobot: number;
    skorTerbobot: number;
  }[];
}

export type NavigationPage = 'dashboard' | 'siswa' | 'kriteria' | 'penilaian' | 'hasil';
