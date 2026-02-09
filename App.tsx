import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProjectDetail from './components/ProjectDetail';
import { PROJECTS_DATA } from './constants';
import type { Project } from './types';

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const App: React.FC = () => {
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>(PROJECTS_DATA[0].slug);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedProject = useMemo(() => {
    return PROJECTS_DATA.find(p => p.slug === selectedProjectSlug) || PROJECTS_DATA[0];
  }, [selectedProjectSlug]);
  
  const handleSelectProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setIsSidebarOpen(false); // Close sidebar on selection (for mobile)
    window.scrollTo(0, 0);
  };

  // Add a listener to close sidebar on window resize if moving to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="md:hidden sticky top-0 bg-gray-800/80 backdrop-blur-sm z-20 flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white truncate">{selectedProject.name}</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>
      </header>
      
      <Sidebar 
        projects={PROJECTS_DATA}
        activeSlug={selectedProject.slug}
        onSelectProject={handleSelectProject}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {selectedProject && <ProjectDetail project={selectedProject} allProjects={PROJECTS_DATA} onSelectProject={handleSelectProject} />}
      </main>
    </div>
  );
};

export default App;