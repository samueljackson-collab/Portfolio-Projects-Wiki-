import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Cloud, Database, Shield, Box, Cpu, Wifi, Terminal, Activity, 
  BarChart, Zap, Image as ImageIcon, Blocks, LayoutTemplate, 
  Smartphone, Server, FolderGit2, Info
} from 'lucide-react';
import ProjectPreviewCard from './ProjectPreviewCard';
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

const getProjectIcon = (project: Project) => {
  const tags = project.tags.map(t => t.toLowerCase());
  const technologies = project.technologies.map(t => t.toLowerCase());
  const allKeywords = [...tags, ...technologies];
  
  const iconClass = "w-4 h-4 mr-3 flex-shrink-0";

  if (allKeywords.some(k => ['aws', 'cloud', 'azure', 'gcp', 'terraform'].includes(k))) 
    return <Cloud className={`${iconClass} text-teal-400`} />;
    
  if (allKeywords.some(k => ['database', 'sql', 'timescaledb', 'data-lake', 'postgres', 'redis', 'sqlite'].includes(k))) 
    return <Database className={`${iconClass} text-blue-400`} />;
    
  if (allKeywords.some(k => ['security', 'cybersecurity', 'cryptography', 'devsecops', 'auth', 'oauth', 'vault'].includes(k))) 
    return <Shield className={`${iconClass} text-red-400`} />;
    
  if (allKeywords.some(k => ['kubernetes', 'docker', 'containers', 'helm', 'argo'].includes(k))) 
    return <Box className={`${iconClass} text-blue-500`} />;
    
  if (allKeywords.some(k => ['ai', 'ml', 'machine-learning', 'llm', 'mlops', 'openai', 'gpt', 'rag'].includes(k))) 
    return <Cpu className={`${iconClass} text-purple-400`} />;
    
  if (allKeywords.some(k => ['iot', 'mqtt', 'embedded'].includes(k))) 
    return <Wifi className={`${iconClass} text-orange-400`} />;
    
  if (allKeywords.some(k => ['blockchain', 'web3', 'solidity', 'smart-contracts', 'ethereum'].includes(k))) 
    return <Blocks className={`${iconClass} text-yellow-400`} />;
    
  if (allKeywords.some(k => ['web', 'react', 'vue', 'frontend', 'next.js', 'ui', 'vitepress'].includes(k))) 
    return <LayoutTemplate className={`${iconClass} text-green-400`} />;
    
  if (allKeywords.some(k => ['mobile', 'ios', 'android', 'react-native'].includes(k))) 
    return <Smartphone className={`${iconClass} text-indigo-400`} />;
    
  if (allKeywords.some(k => ['devops', 'ci-cd', 'automation', 'infrastructure', 'ansible', 'bash'].includes(k))) 
    return <Terminal className={`${iconClass} text-gray-400`} />;
    
  if (allKeywords.some(k => ['monitoring', 'observability', 'grafana', 'prometheus'].includes(k))) 
    return <Activity className={`${iconClass} text-pink-400`} />;
    
  if (allKeywords.some(k => ['data-engineering', 'analytics', 'streaming', 'kafka', 'spark'].includes(k))) 
    return <BarChart className={`${iconClass} text-indigo-400`} />;
    
  if (allKeywords.some(k => ['serverless', 'lambda', 'functions'].includes(k))) 
    return <Zap className={`${iconClass} text-yellow-500`} />;
    
  if (allKeywords.some(k => ['quantum-computing', 'physics'].includes(k))) 
    return <Cpu className={`${iconClass} text-violet-400`} />;
    
  if (allKeywords.some(k => ['photos', 'video', 'media', 'ffmpeg'].includes(k))) 
    return <ImageIcon className={`${iconClass} text-pink-300`} />;
    
  if (allKeywords.some(k => ['api', 'backend', 'server', 'node', 'go', 'python', 'java'].includes(k))) 
    return <Server className={`${iconClass} text-slate-400`} />;
  
  return <FolderGit2 className={`${iconClass} text-gray-500`} />;
};

const Sidebar: React.FC<SidebarProps> = ({ projects, activeSlug, onSelectProject, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedProject, setPinnedProject] = useState<Project | null>(null);
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

  // Handle clicks outside of sidebar and Escape key to close on mobile
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
              onClose();
          }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
          if (isOpen && event.key === 'Escape') {
              onClose();
          }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleKeyDown);
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
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onClose} aria-hidden="true"></div>}
      <aside ref={sidebarRef} className={sidebarClasses}>
        {pinnedProject && (
          <ProjectPreviewCard 
            project={pinnedProject}
            onClose={() => setPinnedProject(null)}
            isPinned={true}
          />
        )}
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
                          <li key={project.id} className="mb-1 relative">
                            <div className="flex items-center justify-between group">
                              <button
                                onClick={() => onSelectProject(project.slug)}
                                className={`flex-grow text-left py-2 px-3 rounded-l-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-transparent focus:text-white focus:bg-gray-700 flex items-center ${
                                  activeSlug === project.slug ? 'bg-gray-700 text-white font-semibold' : ''
                                }`}
                              >
                                {getProjectIcon(project)}
                                <span className="truncate text-sm">{project.name}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPinnedProject(project);
                                }}
                                className={`p-2 rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 flex-shrink-0 ${
                                   activeSlug === project.slug ? 'bg-gray-700 text-teal-400' : 'text-gray-500 hover:text-teal-400 hover:bg-gray-700'
                                }`}
                                title="View project details"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            </div>
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
