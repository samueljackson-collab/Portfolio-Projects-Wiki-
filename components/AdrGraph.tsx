import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import type { ArchitectureDecisionRecord } from '../types';

interface AdrGraphProps {
  adrs: ArchitectureDecisionRecord[];
}

const AdrGraph: React.FC<AdrGraphProps> = ({ adrs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!adrs || adrs.length === 0) {
    return <div className="text-gray-500">No ADRs to display.</div>;
  }

  useEffect(() => {
    let isMounted = true;
    const renderGraph = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

        const classDefs = `
          classDef accepted fill:#064e3b,stroke:#059669,stroke-width:2px,color:#ecfdf5;
          classDef proposed fill:#1e3a8a,stroke:#2563eb,stroke-width:2px,color:#eff6ff;
          classDef deprecated fill:#450a0a,stroke:#dc2626,stroke-width:2px,color:#fef2f2;
          classDef superseded fill:#374151,stroke:#6b7280,stroke-width:2px,color:#f9fafb;
          classDef rejected fill:#7f1d1d,stroke:#b91c1c,stroke-width:2px,color:#fef2f2;
          classDef other fill:#78350f,stroke:#d97706,stroke-width:2px,color:#fff7ed;
        `;

        const graphDefinition = `
          graph TD
            ${classDefs}
            subgraph ADRs
              direction LR
              ${adrs.map(adr => {
                const status = adr.status.toLowerCase();
                let className = 'other';
                if (['accepted', 'proposed', 'deprecated', 'superseded', 'rejected'].includes(status)) {
                    className = status;
                }
                return `${adr.id.replace(/-/g, '_')}["${adr.id}: ${adr.title}"]:::${className}`;
              }).join('\n              ')}
            end
            ${adrs.map(adr => adr.relations?.map(relation => {
                const fromId = adr.id.replace(/-/g, '_');
                const toId = relation.related_adr_id.replace(/-/g, '_');
                return `${fromId} -->|${relation.type}| ${toId}`;
            }).join('\n            ') || '').join('\n            ')}
        `;

        const graphId = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(graphId, graphDefinition);
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering failed', err);
      }
    };
    
    renderGraph();

    return () => { isMounted = false; };
  }, [adrs]);

  return <div ref={containerRef} className="w-full h-full overflow-x-auto"></div>;
};

export default AdrGraph;
