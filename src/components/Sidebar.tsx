import React from 'react';
import { NavigationPage } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  ListChecks, 
  ClipboardCheck, 
  Trophy,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'siswa' as NavigationPage, label: 'Data Siswa', icon: Users },
    { id: 'kriteria' as NavigationPage, label: 'Kriteria', icon: ListChecks },
    { id: 'penilaian' as NavigationPage, label: 'Penilaian AHP', icon: ClipboardCheck },
    { id: 'hasil' as NavigationPage, label: 'Hasil & Rekomendasi', icon: Trophy }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white min-h-screen shadow-2xl">
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg p-2">
            <GraduationCap className="w-8 h-8 text-indigo-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SPK AHP</h1>
            <p className="text-xs text-indigo-200">Pengarah Bakat Siswa</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive 
                  ? 'bg-white text-indigo-900 shadow-lg' 
                  : 'text-indigo-100 hover:bg-indigo-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <div className="text-xs text-indigo-200 text-center">
          <p>© 2025 SPK AHP System</p>
          <p className="mt-1">Analytic Hierarchy Process</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
