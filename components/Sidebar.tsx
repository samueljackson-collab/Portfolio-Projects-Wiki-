import React, { useMemo, useState, useEffect, useRef } from 'react';
import type { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  activeSlug: string;
  onSelectProject: (slug: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const fuzzyMatch = (query: string, text: string): boolean => {
    if (!query) return true;
    query = query.toLowerCase();
    text = text.toLowerCase();
    let queryIndex = 0;
    let textIndex = 0;
    while (queryIndex < query.length && textIndex < text.length) {
        if (query[queryIndex] === text[textIndex]) {
            queryIndex++;
        }
        textIndex++;
    }
    return queryIndex === query.length;
};


const Sidebar: React.FC<SidebarProps> = ({ projects, activeSlug, onSelectProject, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
    }, 200);

    return () => {
        clearTimeout(timer);
    };
  }, [searchQuery]);

  // Handle clicks outside of sidebar to close it on mobile
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
              onClose();
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [isOpen, onClose]);


  const filteredProjects = useMemo(() => {
    if (!debouncedQuery) {
      return projects;
    }
    const lowercasedQuery = debouncedQuery.toLowerCase();
    return projects.filter(p => 
      fuzzyMatch(lowercasedQuery, p.name) ||
      fuzzyMatch(lowercasedQuery, p.description) ||
      p.tags.some(tag => fuzzyMatch(lowercasedQuery, tag))
    );
  }, [projects, debouncedQuery]);

  const groupedProjects = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    for (const project of filteredProjects) {
      if (!groups[project.status]) {
        groups[project.status] = [];
      }
      groups[project.status].push(project);
    }
    return groups;
  }, [filteredProjects]);

  const statusOrder: Project['status'][] = [
    "Production Ready",
    "Advanced",
    "Substantial",
    "In Development",
    "Basic"
  ];

  const sidebarClasses = `
    w-full md:w-80 lg:w-96 bg-gray-800 p-4 md:p-6 flex-shrink-0 flex flex-col
    transition-transform duration-300 ease-in-out
    md:sticky md:top-0 md:h-screen
    fixed top-0 left-0 h-full z-30
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
  `;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose}></div>}
      <aside ref={sidebarRef} className={sidebarClasses}>
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-4">
            Portfolio Projects
          </h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto">
          {filteredProjects.length > 0 ? (
            <ul>
              {statusOrder.map(status => {
                if (!groupedProjects[status] || groupedProjects[status].length === 0) return null;
                return (
                  <li key={status} className="mb-6">
                    <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3">
                      {status}
                    </h2>
                    <ul>
                      {groupedProjects[status]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(project => (
                          <li key={project.id} className="mb-1">
                            <button
                              onClick={() => onSelectProject(project.slug)}
                              className={`w-full text-left p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                                activeSlug === project.slug ? 'bg-gray-700 text-white font-semibold' : ''
                              }`}
                            >
                              {project.name}
                            </button>
                          </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          ) : (
             <div className="text-center text-gray-400 mt-8">
                <p>No projects found.</p>
             </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;