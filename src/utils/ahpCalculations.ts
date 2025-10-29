export const calculateAHP = (
  pairwiseMatrix: number[][],
  criteriaNames: string[]
): { weights: number[]; consistencyRatio: number } => {
  const n = pairwiseMatrix.length;
  
  const columnSums = pairwiseMatrix[0].map((_, colIndex) =>
    pairwiseMatrix.reduce((sum, row) => sum + row[colIndex], 0)
  );
  
  const normalizedMatrix = pairwiseMatrix.map(row =>
    row.map((value, colIndex) => value / columnSums[colIndex])
  );
  
  const weights = normalizedMatrix.map(row =>
    row.reduce((sum, value) => sum + value, 0) / n
  );
  
  const weightedSum = pairwiseMatrix.map((row, i) =>
    row.reduce((sum, value, j) => sum + value * weights[j], 0)
  );
  
  const lambdaMax = weightedSum.reduce((sum, value, i) => sum + value / weights[i], 0) / n;
  
  const CI = (lambdaMax - n) / (n - 1);
  
  const RI: { [key: number]: number } = {
    1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
  };
  
  const consistencyRatio = n > 2 ? CI / RI[n] : 0;
  
  return { weights, consistencyRatio };
};

export const scaleMapping: { [key: number]: string } = {
  1: '1 - Sama penting',
  2: '2 - Sedikit lebih penting',
  3: '3 - Cukup penting',
  4: '4 - Lebih penting',
  5: '5 - Sangat penting',
  6: '6 - Jauh lebih penting',
  7: '7 - Sangat jauh lebih penting',
  8: '8 - Mutlak lebih penting',
  9: '9 - Ekstrim lebih penting'
};

export const getTalentRecommendation = (detailKriteria: any[]): string => {
  const maxKriteria = detailKriteria.reduce((prev, current) => 
    (prev.skorTerbobot > current.skorTerbobot) ? prev : current
  );
  
  const talentMap: { [key: string]: string } = {
    'Kemampuan Matematika': 'STEM & Sains',
    'Kemampuan Verbal': 'Sastra & Bahasa',
    'Kreativitas': 'Seni & Desain',
    'Kepemimpinan': 'Organisasi & Manajemen',
    'Kemampuan Sosial': 'Komunikasi & Sosial',
    'Olahraga': 'Atletik & Kesehatan',
    'Teknologi': 'IT & Programming',
    'Analitis': 'Riset & Data Science'
  };
  
  return talentMap[maxKriteria.namaKriteria] || 'Bakat Umum';
};
