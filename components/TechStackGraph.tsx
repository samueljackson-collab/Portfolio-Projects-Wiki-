import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { Project } from '../types';
import { TECH_PURPOSES, TECHNOLOGY_METADATA } from '../constants';

interface TechStackGraphProps {
  project: Project;
  activeTag: string | null;
  allProjects: Project[];
}

interface NodeData extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    radius: number;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {}

const CATEGORY_COLORS = d3.scaleOrdinal(
    [
        'Cloud & Infrastructure', 'DevOps & CI/CD', 'Data & AI', 'Backend', 
        'Security', 'Blockchain', 'Frontend & Web', 'Quantum Computing', 'HPC & Systems'
    ],
    d3.schemeTableau10
);

const ExternalLinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block ml-1 opacity-70" aria-label="External link"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /> </svg> );


const Tooltip: React.FC<{ activeNode: { data: NodeData, position: { top: number, left: number } } | null; isPinned: boolean; }> = ({ activeNode, isPinned }) => {
    if (!activeNode) return null;

    const purpose = TECH_PURPOSES[activeNode.data.id] || (activeNode.data.group === 0 ? "Project Hub" : 'Core technology');
    const learnMoreLink = `https://www.google.com/search?q=${encodeURIComponent(activeNode.data.id)}+documentation`;
    
    const pulseClass = isPinned ? 'animate-pulse' : '';

    return (
        <div
            className={`fixed p-4 text-sm bg-gray-900 border border-gray-700 text-white rounded-md shadow-lg z-10 max-w-xs pointer-events-none transition-opacity duration-200 ${activeNode ? 'opacity-100' : 'opacity-0'}`}
            style={{ top: activeNode.position.top, left: activeNode.position.left, transform: 'translate(15px, 15px)' }}
        >
            <h4 className={`font-bold text-base text-teal-400 flex items-center ${pulseClass}`}>{activeNode.data.id}</h4>
            
            <div className="mt-2 border-t border-gray-700 pt-2">
                 <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Purpose</p>
                 <p className="text-gray-300">{purpose}</p>
            </div>

            {activeNode.data.group !== 0 && (
                 <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs mt-2 inline-flex items-center pointer-events-auto">
                    <span>Learn More</span>
                    <ExternalLinkIcon />
                </a>
            )}
        </div>
    );
};

const TechStackGraph: React.FC<TechStackGraphProps> = ({ project, activeTag, allProjects }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltipNode, setTooltipNode] = useState<{ data: NodeData, position: { top: number, left: number } } | null>(null);
    const [pinnedNode, setPinnedNode] = useState<NodeData | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const simulationRef = useRef<d3.Simulation<NodeData, any> | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

    const categoriesInUse = useMemo(() => {
        const categorySet = new Set<string>();
        project.technologies.forEach(tech => {
            const meta = TECHNOLOGY_METADATA[tech];
            if (meta) {
                categorySet.add(meta.category);
            }
        });
        return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
    }, [project.technologies]);
    
    const techFrequencies = useMemo(() => {
        const counts: Record<string, number> = {};
        allProjects.forEach(p => {
            p.technologies.forEach(tech => {
                counts[tech] = (counts[tech] || 0) + 1;
            });
        });
        return counts;
    }, [allProjects]);

    const radiusScale = useMemo(() => {
        const techCountValues = Object.values(techFrequencies);
        return d3.scaleSqrt()
            .domain([d3.min(techCountValues) || 1, d3.max(techCountValues) || 1])
            .range([12, 25]);
    }, [techFrequencies]);

    useEffect(() => {
        if (!svgRef.current) return;

        const container = svgRef.current.parentElement;
        if (!container) return;

        const width = container.clientWidth;
        const height = 400;

        const nodes: NodeData[] = [
            { id: project.name, group: 0, radius: 25, fx: null, fy: null },
            ...project.technologies.map(tech => ({
                id: tech,
                group: 1,
                radius: techFrequencies[tech] ? radiusScale(techFrequencies[tech]) : 15,
            }))
        ];

        const links: Omit<LinkData, 'source' | 'target'> & { source: string; target: string }[] = project.technologies.map(tech => ({
            source: tech,
            target: project.name
        }));

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        svg.selectAll('*').remove();

        const mainGroup = svg.append("g");

        const linkDistance = isExpanded ? 180 : 120;
        const chargeStrength = isExpanded ? -300 : -200;
        
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink<NodeData, LinkData>(links).id(d => d.id).distance(linkDistance).strength(0.5))
            .force("charge", d3.forceManyBody().strength(chargeStrength))
            .force("collide", d3.forceCollide<NodeData>().radius(d => d.radius + 8))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alphaDecay(0.08);

        simulationRef.current = simulation;

        const link = mainGroup.append("g")
            .attr("stroke", "#4A5568")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1)
            .style("transition", "stroke-opacity 0.3s ease, stroke-width 0.3s ease");

        const node = mainGroup.append("g")
            .selectAll<SVGGElement, NodeData>("g")
            .data(nodes)
            .join("g")
            .call(drag(simulation));

        node.append("circle")
            .attr("r", d => d.radius)
            .attr("fill", d => {
                if (d.group === 0) return "#2DD4BF";
                const meta = TECHNOLOGY_METADATA[d.id];
                return meta ? CATEGORY_COLORS(meta.category) : "#374151";
            })
            .attr("stroke", d => {
                if (d.group === 0) return "#14B8A6";
                const meta = TECHNOLOGY_METADATA[d.id];
                return meta ? d3.color(CATEGORY_COLORS(meta.category))?.darker(0.7).toString() : "#4A5568";
            })
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .style("transition", "opacity 0.3s ease, r 0.3s ease, filter 0.3s ease, stroke-width 0.3s ease");
        
        node.append("text")
            .text(d => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("fill", "white")
            .style("font-size", d => d.group === 0 ? "12px" : "10px")
            .style("pointer-events", "none")
            .style("font-weight", d => d.group === 0 ? "bold" : "normal")
            .style("transition", "opacity 0.3s ease");

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                mainGroup.attr("transform", event.transform);
            });
        
        svg.call(zoom as any);
        zoomRef.current = zoom;

        node
            .on('mouseover', function(event, d) {
                if (d.group !== 0) {
                    if (!pinnedNode) { setTooltipNode({ data: d, position: { top: event.clientY, left: event.clientX } }); }
                    d3.select(this).select('circle').style('filter', 'drop-shadow(0 0 4px #2DD4BF)');
                }
            })
            .on('mouseout', function(event, d) {
                if (!pinnedNode) { setTooltipNode(null); }
                if (!pinnedNode || d.id !== pinnedNode.id) {
                    d3.select(this).select('circle').style('filter', 'none');
                }
            })
            .on('click', function(event, d) {
                event.stopPropagation();
                if (d.group !== 0) {
                    setPinnedNode(d);
                    setTooltipNode({ data: d, position: { top: event.clientY, left: event.clientX } });
                }
            });

        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as unknown as NodeData).x!)
                .attr("y1", d => (d.source as unknown as NodeData).y!)
                .attr("x2", d => (d.target as unknown as NodeData).x!)
                .attr("y2", d => (d.target as unknown as NodeData).y!);
            node.attr("transform", d => `translate(${d.x}, ${d.y})`);
        });

        function drag(simulation: d3.Simulation<NodeData, undefined>) {
            function dragstarted(event: d3.D3DragEvent<Element, NodeData, any>, d: NodeData) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x; d.fy = d.y;
                setPinnedNode(null); setTooltipNode(null);
            }
            function dragged(event: d3.D3DragEvent<Element, NodeData, any>, d: NodeData) { d.fx = event.x; d.fy = event.y; }
            function dragended(event: d3.D3DragEvent<Element, NodeData, any>, d: NodeData) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null; d.fy = null;
            }
            return d3.drag<any, NodeData>().on("start", dragstarted).on("drag", dragged).on("end", dragended);
        }
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!zoomRef.current) return;
            const { key } = event;
            const panStep = 50;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                event.preventDefault();
                let dx = 0, dy = 0;
                if (key === 'ArrowUp') dy = panStep;
                if (key === 'ArrowDown') dy = -panStep;
                if (key === 'ArrowLeft') dx = panStep;
                if (key === 'ArrowRight') dx = -panStep;
                svg.transition().duration(150).call(zoomRef.current.translateBy, dx, dy);
            } else if (key === '+' || key === '=') {
                event.preventDefault();
                svg.transition().duration(150).call(zoomRef.current.scaleBy, 1.2);
            } else if (key === '-' || key === '_') {
                event.preventDefault();
                svg.transition().duration(150).call(zoomRef.current.scaleBy, 0.8);
            }
        };

        const currentContainer = containerRef.current;
        currentContainer?.addEventListener('keydown', handleKeyDown);

        return () => { 
            simulation.stop(); 
            currentContainer?.removeEventListener('keydown', handleKeyDown);
        };

    }, [project, isExpanded, radiusScale, techFrequencies]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll<SVGGElement, NodeData>('g g').select('circle').interrupt().transition().duration(200).attr('r', d => d.radius).style('filter', null).attr("stroke", d => { if (d.group === 0) return "#14B8A6"; const meta = TECHNOLOGY_METADATA[d.id]; return meta ? d3.color(CATEGORY_COLORS(meta.category))?.darker(0.7).toString() : "#4A5568"; });
        if (pinnedNode) {
            const pinnedG = svg.selectAll<SVGGElement, NodeData>('g g').filter(d => d.id === pinnedNode.id);
            const pinnedCircle = pinnedG.select('circle');
            function pulse() { 
                if (pinnedG.empty() || !pinnedNode) return;
                const datum = pinnedG.datum();
                if (!datum || datum.id !== pinnedNode.id) return;
                
                pinnedCircle.transition().duration(750).ease(d3.easeSinOut).attr('r', d => d.radius * 1.3).style('filter', 'drop-shadow(0 0 8px #2DD4BF)').transition().duration(750).ease(d3.easeSinIn).attr('r', d => d.radius * 1.1).style('filter', 'drop-shadow(0 0 4px #2DD4BF)').on('end', pulse); 
            }
            pulse();
        }
    }, [pinnedNode]);

    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const lowerQuery = searchQuery.toLowerCase();
        const mainGroup = svg.select('g');
        const link = mainGroup.selectAll<SVGLineElement, LinkData>("line");
        const nodeGroups = mainGroup.selectAll<SVGGElement, NodeData>("g g");

        const matchingSearchIds = new Set<string>();
        if (lowerQuery) {
            matchingSearchIds.add(project.name);
            project.technologies.forEach(tech => { if (tech.toLowerCase().includes(lowerQuery)) { matchingSearchIds.add(tech); }});
        }
        
        const isNodeVisible = (d: NodeData | undefined | null): boolean => {
            if (!d) return false;
            const meta = TECHNOLOGY_METADATA[d.id];
            const tagMatch = !activeTag || d.group === 0 || (meta && meta.tags.includes(activeTag));
            const searchMatch = !lowerQuery || matchingSearchIds.has(d.id);
            const categoryMatch = !activeCategory || d.group === 0 || (meta && meta.category === activeCategory);
            return tagMatch && searchMatch && categoryMatch;
        };
        nodeGroups.transition().duration(300).style("opacity", d => isNodeVisible(d) ? 1 : 0.15);
        nodeGroups.select('circle').transition().duration(300).style("filter", d => isNodeVisible(d) && lowerQuery ? 'drop-shadow(0 0 5px #2dd4bf)' : 'none').attr("stroke-width", d => isNodeVisible(d) && lowerQuery ? 2.5 : 2);
        link.transition().duration(300)
            .style("stroke-opacity", d => isNodeVisible(d.source as unknown as NodeData) && isNodeVisible(d.target as unknown as NodeData) ? 0.6 : 0.1)
            .attr("stroke-width", d => isNodeVisible(d.source as unknown as NodeData) && lowerQuery ? 2 : 1);
    }, [activeTag, searchQuery, project, activeCategory]);
    
    const handleFitScreen = () => {
        if (simulationRef.current) {
            simulationRef.current.nodes().forEach(n => { n.fx = null; n.fy = null; });
            simulationRef.current.alpha(1).restart();
        }
        if (svgRef.current && zoomRef.current) {
            d3.select(svgRef.current)
              .transition().duration(750)
              .call(zoomRef.current.transform, d3.zoomIdentity);
        }
    };

    return (
        <div ref={containerRef} tabIndex={-1} className="relative w-full flex flex-col justify-center items-center bg-gray-800/50 rounded-lg p-4 my-4 focus:outline-none">
            <div className="absolute top-2 left-4 z-10">
                <input
                  type="text"
                  placeholder="Filter technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1 text-xs bg-gray-900/50 border border-gray-600 text-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder-gray-400"
                />
            </div>
            <div className="absolute top-2 right-2 z-10 flex gap-2">
                 <button
                    onClick={handleFitScreen}
                    className="px-3 py-1 text-xs font-medium bg-gray-700 text-cyan-200 rounded-md hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    aria-label="Fit graph to screen"
                 >
                    Fit to Screen
                 </button>
                 <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-3 py-1 text-xs font-medium bg-gray-700 text-cyan-200 rounded-md hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    aria-label={isExpanded ? 'Collapse graph view' : 'Expand graph view'}
                >
                    {isExpanded ? 'Collapse View' : 'Expand View'}
                </button>
            </div>
            <svg ref={svgRef}></svg>
            <div className="w-full mt-4 flex flex-wrap justify-center items-center gap-2 border-t border-gray-700 pt-4">
                <button 
                    onClick={() => setActiveCategory(null)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-400 ${
                        !activeCategory ? 'bg-teal-500 text-white font-semibold' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    All Categories
                </button>
                {categoriesInUse.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(prev => prev === category ? null : category)}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:ring-teal-400 ${
                            activeCategory === category ? 'bg-teal-500 text-white font-semibold' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                        }`}
                        aria-pressed={activeCategory === category}
                    >
                        <span 
                            className="w-3 h-3 rounded-full mr-2 border border-gray-900/50" 
                            style={{ backgroundColor: CATEGORY_COLORS(category) }}
                        ></span>
                        <span>{category}</span>
                    </button>
                ))}
            </div>
            <Tooltip activeNode={tooltipNode} isPinned={!!pinnedNode && tooltipNode?.data.id === pinnedNode.id} />
        </div>
    );
};

export default TechStackGraph;