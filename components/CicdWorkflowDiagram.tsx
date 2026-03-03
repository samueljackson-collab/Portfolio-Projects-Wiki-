import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import yaml from 'js-yaml';
import type { CicdWorkflow } from '../types';

interface CicdWorkflowDiagramProps {
  workflow: CicdWorkflow;
}

const CicdWorkflowDiagram: React.FC<CicdWorkflowDiagramProps> = ({ workflow }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderGraph = async () => {
      if (ref.current) {
        try {
          mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
          const graph = generateMermaidGraph(workflow);
          if (graph) {
            const id = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await mermaid.render(id, graph);
            if (ref.current) {
              ref.current.innerHTML = svg;
            }
          }
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      }
    };

    renderGraph();
  }, [workflow]);

  return <div ref={ref} className="bg-gray-900 p-4 rounded-lg overflow-x-auto" />;
};

function generateMermaidGraph(workflow: CicdWorkflow): string {
  try {
    const data = yaml.load(workflow.content) as Record<string, unknown>;
    if (!data || !data.jobs || typeof data.jobs !== 'object' || data.jobs === null) return '';

    let graph = 'graph TD;\n';
    const jobsData = data.jobs as Record<string, { needs?: string | string[] }>;
    const jobs = Object.keys(jobsData);

    jobs.forEach(job => {
      const jobNodeId = job.replace(/[^a-zA-Z0-9]/g, '_');
      graph += `  ${jobNodeId}["${job}"];\n`;
      const currentJob = jobsData[job];
      if (currentJob.needs) {
        if (Array.isArray(currentJob.needs)) {
          currentJob.needs.forEach(need => {
            const needNodeId = need.replace(/[^a-zA-Z0-9]/g, '_');
            graph += `  ${needNodeId} --> ${jobNodeId};\n`;
          });
        } else {
          const needNodeId = currentJob.needs.replace(/[^a-zA-Z0-9]/g, '_');
          graph += `  ${needNodeId} --> ${jobNodeId};\n`;
        }
      }
    });

    return graph;
  } catch (e) {
    console.error('Error parsing YAML for CI/CD workflow:', e);
    return '';
  }
}

export default CicdWorkflowDiagram;
