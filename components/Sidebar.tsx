import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Cloud, Database, Shield, Box, Cpu, Wifi, Terminal, Activity, 
  BarChart, Zap, Image as ImageIcon, Blocks, LayoutTemplate, 
  Smartphone, Server, FolderGit2, Info, Github, ExternalLink
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

  if (allKeywords.some(k => ['aws', 'cloud', 'azure', 'gcp', 'terraform', 'pulumi', 'aws cdk', 'aws sam', 'aws iot core', 'aws route53', 'aws rds global', 'aws batch', 'eks', 'rds', 'dynamodb'].includes(k))) 
    return <Cloud className={`${iconClass} text-teal-400`} />;
    
  if (allKeywords.some(k => ['database', 'sql', 'timescaledb', 'data-lake', 'postgres', 'postgresql', 'redis', 'sqlite', 'vector db', 'aws-dms'].includes(k))) 
    return <Database className={`${iconClass} text-blue-400`} />;
    
  if (allKeywords.some(k => ['security', 'cybersecurity', 'cryptography', 'devsecops', 'auth', 'oauth', 'vault', 'sast', 'dast', 'trivy', 'sonarqube', 'owasp zap', 'soc', 'siem', 'soar', 'post-quantum', 'kyber'].includes(k))) 
    return <Shield className={`${iconClass} text-red-400`} />;
    
  if (allKeywords.some(k => ['kubernetes', 'docker', 'containers', 'helm', 'argo', 'argocd', 'kustomize', 'kubernetes api', 'service-mesh', 'istio', 'consul', 'operators', 'kopf'].includes(k))) 
    return <Box className={`${iconClass} text-blue-500`} />;
    
  if (allKeywords.some(k => ['ai', 'ml', 'machine-learning', 'llm', 'mlops', 'openai', 'gpt', 'rag', 'mlflow', 'optuna', 'scikit-learn', 'langchain', 'inference', 'onnx', 'onnx runtime', 'edge-ai'].includes(k))) 
    return <Cpu className={`${iconClass} text-purple-400`} />;
    
  if (allKeywords.some(k => ['iot', 'mqtt', 'embedded', 'azure iot edge'].includes(k))) 
    return <Wifi className={`${iconClass} text-orange-400`} />;
    
  if (allKeywords.some(k => ['blockchain', 'web3', 'solidity', 'smart-contracts', 'ethereum', 'hardhat', 'ethers.js', 'oracle', 'chainlink'].includes(k))) 
    return <Blocks className={`${iconClass} text-yellow-400`} />;
    
  if (allKeywords.some(k => ['web', 'react', 'vue', 'frontend', 'next.js', 'ui', 'vitepress', 'vue.js', 'tailwind css', 'accessibility'].includes(k))) 
    return <LayoutTemplate className={`${iconClass} text-green-400`} />;
    
  if (allKeywords.some(k => ['mobile', 'ios', 'android', 'react-native'].includes(k))) 
    return <Smartphone className={`${iconClass} text-indigo-400`} />;
    
  if (allKeywords.some(k => ['devops', 'ci-cd', 'automation', 'infrastructure', 'ansible', 'bash', 'github actions', 'github-actions', 'jinja2', 'pyyaml', 'typer', 'dr', 'reliability'].includes(k))) 
    return <Terminal className={`${iconClass} text-gray-400`} />;
    
  if (allKeywords.some(k => ['monitoring', 'observability', 'grafana', 'prometheus', 'elk stack', 'loki', 'thanos', 'prometheus api'].includes(k))) 
    return <Activity className={`${iconClass} text-pink-400`} />;
    
  if (allKeywords.some(k => ['data-engineering', 'analytics', 'streaming', 'kafka', 'spark', 'apache kafka', 'apache flink', 'flink', 'avro', 'databricks', 'delta lake', 'glue', 'athena'].includes(k))) 
    return <BarChart className={`${iconClass} text-indigo-400`} />;
    
  if (allKeywords.some(k => ['serverless', 'lambda', 'functions', 'step-functions', 'step functions'].includes(k))) 
    return <Zap className={`${iconClass} text-yellow-500`} />;
    
  if (allKeywords.some(k => ['quantum-computing', 'physics', 'qiskit', 'research'].includes(k))) 
    return <Cpu className={`${iconClass} text-violet-400`} />;
    
  if (allKeywords.some(k => ['photos', 'video', 'media', 'ffmpeg', 'imagehash', 'video-processing'].includes(k))) 
    return <ImageIcon className={`${iconClass} text-pink-300`} />;
    
  if (allKeywords.some(k => ['api', 'backend', 'server', 'node', 'go', 'python', 'java', 'fastapi', 'node.js', 'typescript', 'grpc', 'websockets', 'real-time', 'collaboration', 'crdt', 'redis'].includes(k))) 
    return <Server className={`${iconClass} text-slate-400`} />;
  
  return <FolderGit2 className={`${iconClass} text-gray-500`} />;
};

const Sidebar: React.FC<SidebarProps> = ({ projects, activeSlug, onSelectProject, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedProject, setPinnedProject] = useState<Project | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
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

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => {
      p.tags.forEach(t => tags.add(t));
      // p.technologies.forEach(t => tags.add(t)); // Optional: include technologies as tags
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (selectedTag) {
      result = result.filter(p => p.tags.includes(selectedTag));
    }

    if (!debouncedQuery) {
      return result;
    }
    const lowercasedQuery = debouncedQuery.toLowerCase();
    return result.filter(p => 
      fuzzyMatch(lowercasedQuery, p.name) ||
      fuzzyMatch(lowercasedQuery, p.description) ||
      p.tags.some(tag => fuzzyMatch(lowercasedQuery, tag))
    );
  }, [projects, debouncedQuery, selectedTag]);

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
          <div className="mb-4 space-y-3">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            
            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar pb-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  !selectedTag 
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' 
                    : 'text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-300'
                }`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    selectedTag === tag 
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50' 
                      : 'text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {filteredProjects.length > 0 ? (
            <ul>
              {statusOrder.map(status => {
                if (!groupedProjects[status] || groupedProjects[status].length === 0) return null;
                return (
                  <li key={status} className="mb-8">
                    <h2 className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-4 pl-1">
                      {status}
                    </h2>
                    <ul className="space-y-3">
                      {groupedProjects[status]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(project => (
                          <li key={project.id} className="relative group">
                            <div className="flex items-stretch rounded-lg overflow-hidden transition-colors duration-200 hover:bg-gray-700/50">
                              <button
                                onClick={() => onSelectProject(project.slug)}
                                className={`flex-grow text-left p-3 focus:outline-none focus:bg-gray-700 ${
                                  activeSlug === project.slug ? 'bg-gray-700' : ''
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="mt-0.5 text-gray-400 group-hover:text-teal-400 transition-colors">
                                    {getProjectIcon(project)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className={`text-sm font-medium truncate mb-1 ${
                                      activeSlug === project.slug ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                    }`}>
                                      {project.name}
                                    </div>
                                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                                      activeSlug === project.slug ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'
                                    }`}>
                                      {project.description}
                                    </p>
                                    <div className="mt-2 flex items-center space-x-3">
                                      {project.github_path && (
                                        <a
                                          href={`https://github.com/samueljackson-collab/Portfolio-Project/tree/main/${project.github_path}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gray-500 hover:text-white transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                          title="View on GitHub"
                                        >
                                          <Github className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {project.live_demo_url && (
                                        <a
                                          href={project.live_demo_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gray-500 hover:text-teal-400 transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                          title="Live Demo"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {project.documentation_url && (
                                        <a
                                          href={project.documentation_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gray-500 hover:text-blue-400 transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                          title="Documentation"
                                        >
                                          <LayoutTemplate className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {project.external_links?.map((link, idx) => (
                                        <a
                                          key={idx}
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gray-500 hover:text-white transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                          title={link.title}
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </button>
                              
                              <div className={`flex flex-col justify-center border-l border-gray-700 ${
                                activeSlug === project.slug ? 'bg-gray-700' : ''
                              }`}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPinnedProject(project);
                                  }}
                                  className={`p-3 h-full flex items-center justify-center transition-colors ${
                                     activeSlug === project.slug 
                                      ? 'text-teal-400' 
                                      : 'text-gray-600 hover:text-teal-400 hover:bg-gray-600/30'
                                  }`}
                                  title="View project details"
                                >
                                  <Info className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          ) : (
             <div className="text-center text-gray-500 mt-12 italic">
                <p>No projects found matching your criteria.</p>
             </div>
          )}
        </nav>
      
      </aside>
    </>
  );
};

export default Sidebar;
