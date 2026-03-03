import React, { useEffect, useId } from 'react';
import mermaid from 'mermaid';
import type { ArchitectureDecisionRecord } from '../types';

interface AdrGraphProps {
  adrs: ArchitectureDecisionRecord[];
}

const AdrGraph: React.FC<AdrGraphProps> = ({ adrs }) => {
  if (!adrs || adrs.length === 0) {
    return <div className="text-gray-500">No ADRs to display.</div>;
  }
  const graphId = useId();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'dark' });

    const graphDefinition = `
      graph TD
        subgraph ADRs
          direction LR
          ${adrs.map(adr => `${adr.id}["${adr.title}"]`).join('\n')}
        end
        ${adrs.map(adr => adr.relations?.map(relation => `${adr.id} -->|${relation.type}| ${relation.related_adr_id}`).join('\n') || '').join('\n')}
    `;

    mermaid.render(graphId, graphDefinition).then(({ svg }) => {
      const container = document.getElementById(graphId);
      if (container) {
        container.innerHTML = svg;
      }
    });
  }, [adrs, graphId]);

  return <div id={graphId} className="w-full h-full"></div>;
};

export default AdrGraph;
