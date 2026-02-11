
import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Project, ProblemContext, ArchitectureDefinition, KeyConcept } from '../types';
// FIX: Corrected import paths and added missing imports that were causing errors.
import { PROJECTS_DATA, TECHNOLOGY_DEEP_DIVES, PROBLEM_CONTEXTS, ARCHITECTURE_DEFINITIONS } from '../constants';
import ProgressBar from './ProgressBar';
import CodeBlock from './CodeBlock';
import TechStackGraph from './TechStackGraph';
import ProjectInsights from './ProjectInsights';
import { 
    GitHubIcon, InfoIcon, CheckCircleIcon, XCircleIcon, ExternalLinkIcon, DownloadIcon, 
    SummaryIcon, LightbulbIcon, TargetIcon, GraduationCapIcon, ArchitectureIcon, 
    ToolsIcon, MicroscopeIcon, BookIcon, GearsIcon, LinkIcon, ResourcesIcon, 
    PhotographIcon, MatrixIcon, DecisionIcon, ShieldBugIcon, WorkflowIcon,
    DocumentTextIcon
} from './Icons';

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onSelectProject: (slug: string) => void;
}

const TagIcon: React.FC<{ tag: string }> = ({ tag }) => {
    const commonProps = {
        className: "w-4 h-4 mr-2 flex-shrink-0",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: "2"
    };

    const iconMap: Record<string, React.ReactNode> = {
        aws: <svg {...commonProps}><path d="M17.5 19h-11a7 7 0 115-12.8A5 5 0 1117.5 19z" /></svg>,
        database: <svg {...commonProps}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
        python: <svg {...commonProps}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
        kubernetes: <svg {...commonProps}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
        security: <svg {...commonProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
        'ci-cd': <svg {...commonProps}><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 12 4.5V1H8v3.5a9 9 0 0 0 8.49 13.5V23h4v-3.5A9 9 0 0 0 20.49 9z"/></svg>,
    };

    return iconMap[tag] || <svg {...commonProps}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px' 
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section
            ref={ref}
            className={`mb-12 transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
            <h2 className="text-2xl font-bold text-teal-400 mb-4 border-b-2 border-gray-700 pb-2 flex items-center">
                <div className="mr-3 w-7 h-7 flex-shrink-0 flex items-center justify-center">{icon}</div>
                {title}
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300">{children}</div>
        </section>
    );
};

const statusConfig: Record<Project['status'], { color: string }> = {
  "Production Ready": { color: 'bg-green-600' },
  "Advanced": { color: 'bg-blue-600' },
  "Substantial": { color: 'bg-purple-600' },
  "In Development": { color: 'bg-yellow-600' },
  "Basic": { color: 'bg-gray-600' },
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, allProjects, onSelectProject }) => {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  
  const getStorageKey = (slug: string) => `project-wiki-active-tag-${slug}`;

  useEffect(() => {
    const savedTag = localStorage.getItem(getStorageKey(project.slug));
    if (savedTag && project.tags.includes(savedTag)) {
        setActiveTag(savedTag);
    } else {
        setActiveTag(null);
    }
  }, [project]);

  const handleSetActiveTag = (tag: string | null) => {
    setActiveTag(tag);
    if (tag) {
        localStorage.setItem(getStorageKey(project.slug), tag);
    } else {
        localStorage.removeItem(getStorageKey(project.slug));
    }
  };

  const getProjectContent = (): { context: ProblemContext, architecture: ArchitectureDefinition } => {
    for (const tag of project.tags) {
      if (tag in PROBLEM_CONTEXTS && tag in ARCHITECTURE_DEFINITIONS) {
        return { context: PROBLEM_CONTEXTS[tag], architecture: ARCHITECTURE_DEFINITIONS[tag] };
      }
    }
    return { context: PROBLEM_CONTEXTS.default, architecture: ARCHITECTURE_DEFINITIONS.default };
  };

  const relatedProjects = useMemo(() => {
      const currentTags = new Set(project.tags);
      return allProjects
          .filter(p => p.id !== project.id)
          .map(p => ({ project: p, overlap: [...currentTags].filter(tag => new Set(p.tags).has(tag)).length }))
          .filter(item => item.overlap > 0)
          .sort((a, b) => b.overlap - a.overlap)
          .slice(0, 3);
  }, [project, allProjects]);

  const deepDives = useMemo(() => {
    const dives = new Set<string>();
    for (const tag of project.tags) {
      if (tag in TECHNOLOGY_DEEP_DIVES) dives.add(tag);
    }
    const techBasedDives = project.technologies.filter(tech => tech.toLowerCase() in TECHNOLOGY_DEEP_DIVES);
    techBasedDives.forEach(tech => dives.add(tech.toLowerCase()));
    
    return [...dives].slice(0, 3).map(key => [key, TECHNOLOGY_DEEP_DIVES[key]] as const);
  }, [project.technologies, project.tags]);

  const { context: problemContext, architecture: architectureDef } = getProjectContent();
  const projectStatusConfig = statusConfig[project.status];
  
  const tagButtonBaseClasses = 'inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ease-in-out transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-teal-400 hover:-translate-y-px';

  return (
    <article key={project.slug} className="max-w-4xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">{project.name}</h1>
        <p className="text-lg text-gray-400 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-3 my-4">
            <a href={`https://github.com/samueljackson-collab/Portfolio-Project/tree/main/${project.github_path}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-transparent hover:border-teal-500 hover:bg-gray-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" aria-label={`View ${project.name} on GitHub (opens in a new tab)`}>
                <GitHubIcon />
                <span>View on GitHub</span>
                <ExternalLinkIcon/>
            </a>
            <a href="https://github.com/samueljackson-collab/Portfolio-Project/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md border border-transparent hover:border-teal-500 hover:bg-gray-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400" aria-label="Download project source code as a zip file">
                <DownloadIcon />
                <span>Download Source</span>
            </a>
        </div>
        <div className="flex items-center space-x-4 mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-semibold text-white ${projectStatusConfig.color} rounded-full`}>{project.status}</span>
            <ProgressBar percentage={project.completion_percentage} />
        </div>
        <div className="flex flex-wrap gap-2"> {project.tags.map(tag => ( <span key={tag} className="px-3 py-1 text-xs font-medium text-cyan-200 bg-gray-700 rounded-full">{tag}</span> ))} </div>
      </header>
      
      <Section title="Project Metadata" icon={<InfoIcon />}>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                  <dt className="font-semibold text-gray-400">Project ID</dt>
                  <dd className="mt-1 text-base font-mono text-white">{project.id}</dd>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                  <dt className="font-semibold text-gray-400">Creation Date</dt>
                  <dd className="mt-1 text-base text-gray-500 italic">Data Not Available</dd>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                  <dt className="font-semibold text-gray-400">Last Modified</dt>
                  <dd className="mt-1 text-base text-white">{new Date().toISOString().split('T')[0]}</dd>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                  <dt className="font-semibold text-gray-400">Contributors</dt>
                  <dd className="mt-1 text-base text-white">Samuel Jackson</dd>
              </div>
          </dl>
      </Section>
      
      <hr className="border-gray-700 my-8"/>
      
      <Section title="About This Project" icon={<SummaryIcon />}>
        <p className="text-lg leading-relaxed mb-6">{project.description}</p>
        {project.key_takeaways && project.key_takeaways.length > 0 && (
          <>
            <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-3">Key Achievements & Learnings</h4>
            <ul className="space-y-3">
              {project.key_takeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start">
                      <CheckCircleIcon />
                      <span>{takeaway}</span>
                  </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {project.readme && (
        <Section title="README" icon={<DocumentTextIcon />}>
            <CodeBlock language="markdown" code={project.readme} />
        </Section>
      )}

      <Section title="Problem Statement" icon={<TargetIcon />}>
          <h3 className="text-xl font-semibold text-white mb-2">{problemContext.title}</h3>
          <p className="text-lg leading-relaxed mb-6 whitespace-pre-line">{problemContext.context}</p>
          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-3">Business Impact</h4>
          <ul className="list-disc pl-5 space-y-2"> {problemContext.business_impact.map(item => <li key={item} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-100">$1</strong>') }} />)} </ul>
          <h4 className="text-lg font-semibold text-gray-200 mt-6 mb-3">Solution Approach</h4>
          <ul className="list-disc pl-5 space-y-2"> {problemContext.solution_approach.map(item => <li key={item} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-100">$1</strong>') }} />)} </ul>
      </Section>
      
      <Section title="Learning Objectives" icon={<GraduationCapIcon />}>
          <p className="mb-4">By studying this project, you will learn to:</p>
          <ul className="space-y-3"> {problemContext.learning_objectives.map(obj => ( <li key={obj} className="flex items-start"><CheckCircleIcon /><span>{obj}</span></li> ))} </ul>
      </Section>

      <Section title="Architecture Overview" icon={<ArchitectureIcon />}>
          <h3 className="text-xl font-semibold text-white mb-3">{architectureDef.title}</h3>
          <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-200 mb-2">Component Layers</h4>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                  {Object.entries(architectureDef.layers).map(([layer, desc]) => ( <li key={layer}><strong>{layer}:</strong> {desc}</li> ))}
              </ul>
              <h4 className="font-semibold text-gray-200 mb-2">Data Flow</h4>
              <ol className="list-decimal pl-5 space-y-2">
                  {architectureDef.data_flow.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
          </div>
          <div className="mt-4 p-4 bg-blue-900/20 border-l-4 border-blue-400 text-blue-200 rounded-r-lg">
             <strong className="block font-semibold">Real-World Scenario</strong>
             <p className="mt-1" dangerouslySetInnerHTML={{ __html: architectureDef.real_world_scenario.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-400 font-semibold">$1</strong>') }} />
          </div>
      </Section>
      
      {project.adr && (
        <Section title="Architecture Decision Records" icon={<DecisionIcon />}>
            <CodeBlock language="markdown" code={project.adr} />
        </Section>
      )}

      {project.threatModel && (
          <Section title="Threat Model" icon={<ShieldBugIcon />}>
              <CodeBlock language="markdown" code={project.threatModel} />
          </Section>
      )}

       <ProjectInsights project={project} />
      
      <Section title="Tech Stack Selection" icon={<ToolsIcon />}>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-gray-400 mr-2">Filter by tag:</span>
            <button onClick={() => handleSetActiveTag(null)} className={`${tagButtonBaseClasses} ${!activeTag ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-gray-700 text-cyan-200 hover:bg-gray-600'}`} aria-pressed={!activeTag}>All</button>
            {project.tags.map(tag => ( <button key={tag} onClick={() => handleSetActiveTag(tag === activeTag ? null : tag)} className={`${tagButtonBaseClasses} ${activeTag === tag ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-gray-700 text-cyan-200 hover:bg-gray-600'}`} aria-pressed={activeTag === tag}><TagIcon tag={tag} /> {tag}</button>))}
          </div>
          <TechStackGraph project={project} activeTag={activeTag} allProjects={allProjects} />
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Why This Stack?</h3>
          <p>This combination was chosen to balance <strong>developer productivity</strong>, <strong>operational simplicity</strong>, and <strong>production reliability</strong>. Each component integrates seamlessly while serving a specific purpose in the overall architecture.</p>
      </Section>

      <Section title="Key Features" icon={<BookIcon />}>
        <div className="space-y-3">
          {project.features.map((feature, index) => (
            <details key={index} id={`feature-walkthrough-${index}`} className="bg-gray-800/50 rounded-lg group transition-all duration-300 hover:bg-gray-800/70 scroll-mt-20">
              <summary className="p-4 list-none flex items-center justify-between cursor-pointer font-semibold text-white">
                <span className="flex items-center">
                  <CheckCircleIcon />
                  <span className="ml-3">{feature}</span>
                </span>
                <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-4 border-t border-gray-700 text-gray-400 text-sm">
                <p>
                  This section details the implementation of the '<strong>{feature}</strong>' feature. It covers the core logic, data models, and service interactions. The component is designed for modularity and follows established design patterns to ensure maintainability and testability within the project's architecture.
                </p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Technology Deep Dives" icon={<MicroscopeIcon />}>
        {deepDives.length > 0 ? (
          deepDives.map(([techKey, dive]) => {
              const codeMatch = dive.code_example?.match(/```(\w+)\n/);
              const lang = codeMatch ? codeMatch[1] : 'bash';
              const code = dive.code_example?.replace(/```\w+\n?/, '').replace(/```$/, '') || '';
              const relatedFeatures = project.features
                .map((feature, index) => ({ feature, index }))
                .filter(({ feature }) => {
                    const lowerFeature = feature.toLowerCase();
                    const lowerTech = techKey.toLowerCase();
                    const lowerTitle = dive.title.toLowerCase().replace('why ', '').replace('?', '');
                    return lowerFeature.includes(lowerTech) || lowerFeature.includes(lowerTitle);
                });

              return (
                <div key={dive.title} className="mb-8 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-2">{dive.title}</h3>
                    <p className="mb-4 whitespace-pre-line">{dive.explanation}</p>
                    
                    {dive.key_concepts && <>
                        <strong className="text-gray-200 mt-4 block">Key Concepts:</strong>
                        <dl className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {Object.entries(dive.key_concepts).map(([key, value]) => {
                                const concept: KeyConcept = typeof value === 'string' ? { description: value } : { description: '', ...(value as object) };
                                return (
                                <div key={key} className="bg-gray-900/50 p-3 rounded-md transition-all duration-200 hover:bg-gray-900/75 hover:scale-[1.02]">
                                    <dt className="font-semibold text-teal-400">{key}</dt>
                                    <dd className="text-gray-400 text-sm mt-1">{concept.description}</dd>
                                    {concept.code_example && (
                                        <div className="mt-3">
                                            <CodeBlock language={concept.lang || 'bash'} code={concept.code_example.trim()} />
                                        </div>
                                    )}
                                </div>
                            )})}
                        </dl>
                    </>}

                    {dive.real_world_scenario &&
                        <div className="mt-4 p-4 bg-blue-900/20 border-l-4 border-blue-400 text-blue-200 rounded-r-lg">
                            <strong className="block font-semibold">Real-World Scenario</strong>
                            <p className="mt-1" dangerouslySetInnerHTML={{ __html: dive.real_world_scenario.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-400 font-semibold">$1</strong>') }} />
                        </div>
                    }

                    {dive.code_example && <CodeBlock language={lang} code={code.trim()} />}
                    
                    <strong className="text-gray-200 mt-4 block">Key Benefits:</strong>
                    <ul className="list-disc pl-5 my-2 space-y-1"> {dive.benefits.map(b => <li key={b} dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-100">$1</strong>') }} />)} </ul>
                    
                    {dive.best_practices && <><strong className="text-gray-200 mt-4 block">Best Practices:</strong><ul className="my-2 space-y-2"> {dive.best_practices.map(bp => <li key={bp} className="flex items-start"><CheckCircleIcon/><span>{bp}</span></li>)} </ul></>}
                    
                    {dive.anti_patterns && <><strong className="text-gray-200 mt-4 block">Common Pitfalls:</strong><ul className="my-2 space-y-2"> {dive.anti_patterns.map(ap => <li key={ap} className="flex items-start p-2 rounded bg-red-900/20 border-l-2 border-red-500/70"><XCircleIcon/><span>{ap}</span></li>)} </ul></>}
                    
                    {relatedFeatures.length > 0 && (
                        <>
                            <h4 className="font-semibold text-gray-200 mt-4 mb-2">Related Implementation Details:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {relatedFeatures.map(({ feature, index }) => (
                                    <li key={index}>
                                        <a href={`#feature-walkthrough-${index}`} onClick={(e) => {
                                            e.preventDefault();
                                            const element = document.getElementById(`feature-walkthrough-${index}`);
                                            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }} className="text-blue-400 hover:text-teal-300 hover:underline transition-colors duration-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">
                                            {feature}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <strong className="text-gray-200 mt-4 block">Learn More:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {dive.learning_resources.map(r => {
                            const match = r.match(/\[(.*?)\]\((.*?)\)/);
                            const text = match ? match[1] : r;
                            const url = match ? match[2] : `https://www.google.com/search?q=${encodeURIComponent(text)}+documentation`;
                            return (
                                <li key={r}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-teal-300 hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded" aria-label={`${text} (opens in a new tab)`}>
                                        {text}
                                        <ExternalLinkIcon/>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
              )
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30 text-center"> <InfoIcon /> <p className="text-gray-500 font-medium">Data Not Available</p> <p className="text-sm text-gray-600 mt-1">No specific technology deep-dives are available for this project's tags.</p> </div>
        )}
      </Section>
      
      {project.cicdWorkflow && (
        <Section title="CI/CD Workflow" icon={<WorkflowIcon />}>
            <h3 className="text-lg font-semibold text-white mb-2">{project.cicdWorkflow.name}</h3>
            <p className="text-sm text-gray-400 mb-4">Location: <code>{project.cicdWorkflow.path}</code></p>
            <CodeBlock language="yaml" code={project.cicdWorkflow.content} />
        </Section>
      )}
      
      <Section title="UI Mockups" icon={<PhotographIcon />}>
        <p className="mb-6">Illustrative mockups representing potential user interfaces for this project.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Dashboard View', 'Configuration Panel', 'Results Display'].map((caption, index) => (
            <figure key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <img 
                src={`https://picsum.photos/seed/${project.slug}-${index}/800/600`} 
                alt={`${caption} for ${project.name}`}
                className="w-full h-48 object-cover"
              />
              <figcaption className="p-3 text-center text-sm text-gray-400">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Operational Guide" icon={<GearsIcon />}>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Monitoring & Observability</h3> <ul className="list-disc pl-5 space-y-1"> <li><strong>Metrics</strong>: Key metrics are exposed via Prometheus endpoints</li> <li><strong>Logs</strong>: Structured JSON logging for aggregation</li> <li><strong>Traces</strong>: OpenTelemetry instrumentation for distributed tracing</li> </ul>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Common Operations</h3> <table className="min-w-full divide-y divide-gray-600"> <thead className="bg-gray-800"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Task</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Command</th> </tr> </thead> <tbody className="bg-gray-800/50 divide-y divide-gray-700"> <tr><td className="px-6 py-4 text-sm font-medium text-white">Health check</td><td className="px-6 py-4 text-sm text-gray-400 font-mono">make health</td></tr> <tr><td className="px-6 py-4 text-sm font-medium text-white">View logs</td><td className="px-6 py-4 text-sm text-gray-400 font-mono">docker-compose logs -f</td></tr> <tr><td className="px-6 py-4 text-sm font-medium text-white">Run tests</td><td className="px-6 py-4 text-sm text-gray-400 font-mono">make test</td></tr> <tr><td className="px-6 py-4 text-sm font-medium text-white">Deploy</td><td className="px-6 py-4 text-sm text-gray-400 font-mono">make deploy</td></tr> </tbody> </table>
        <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Troubleshooting</h3>
        <p className="mb-4 text-sm">
            For persistent issues, please check existing reports or file a new one on the project's 
            <a href="https://github.com/samueljackson-collab/Portfolio-Project/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-teal-300 hover:underline ml-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded" aria-label="Report issues on GitHub (opens in a new tab)">
                GitHub issues page<ExternalLinkIcon/>
            </a>.
        </p>
        <details className="bg-gray-800/50 p-4 rounded-lg cursor-pointer">
          <summary className="font-semibold text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded">Common Issues</summary>
          <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
            <li><strong>Connection refused:</strong> Ensure all services are running via <code>docker-compose ps</code>. Check container logs for startup errors.</li>
            <li><strong>Authentication failure:</strong> Verify credentials in <code>.env</code> match the required values. Ensure the file is being loaded correctly.</li>
            <li><strong>Resource limits:</strong> If containers are slow or crashing, check resource allocation in Docker Desktop or via <code>docker stats</code>.</li>
          </ol>
        </details>
      </Section>
      
      {relatedProjects.length > 0 && (
          <Section title="Related Projects" icon={<LinkIcon />}>
              <ul className="space-y-3">
                  {relatedProjects.map(({ project: p }) => (
                      <li key={p.id}>
                          <button onClick={() => onSelectProject(p.slug)} className="text-blue-400 hover:text-teal-300 hover:underline font-semibold text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded">
                              {p.name}
                          </button>
                          <p className="text-sm text-gray-400 mt-1">{p.description}</p>
                      </li>
                  ))}
              </ul>
          </Section>
      )}

      <footer className="mt-12 pt-6 border-t border-gray-700">
         <Section title="Resources" icon={<ResourcesIcon />}>
             <ul className="list-disc pl-5 space-y-2"> 
                <li>
                    <strong>Source Code</strong>: 
                    <a href={`https://github.com/samueljackson-collab/Portfolio-Project/tree/main/${project.github_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-teal-300 hover:underline ml-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded" aria-label={`View ${project.name} Source Code on GitHub (opens in a new tab)`}>
                        GitHub Repository<ExternalLinkIcon/>
                    </a>
                </li>
                <li>
                    <strong>Project Documentation</strong>: 
                    <a href={`https://github.com/samueljackson-collab/Portfolio-Project/blob/main/${project.github_path}/docs/index.md`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-teal-300 hover:underline ml-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded" aria-label={`View ${project.name} Documentation on GitHub (opens in a new tab)`}>
                        View Documentation<ExternalLinkIcon/>
                    </a>
                </li>
                <li>
                    <strong>Issues</strong>: 
                    <a href="https://github.com/samueljackson-collab/Portfolio-Project/issues" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-teal-300 hover:underline ml-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded" aria-label="Report issues on GitHub (opens in a new tab)">
                        Report bugs or request features<ExternalLinkIcon/>
                    </a>
                </li>
            </ul>
         </Section>
      </footer>
    </article>
  );
};
