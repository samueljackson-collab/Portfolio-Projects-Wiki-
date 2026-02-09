import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { Project } from '../types';
import { TECHNOLOGY_METADATA } from '../constants';
import { ChartPieIcon, MatrixIcon } from './Icons';

interface ProjectInsightsProps {
  project: Project;
}

const CATEGORY_COLORS = d3.scaleOrdinal(d3.schemeTableau10).domain([
    'Cloud & Infrastructure', 'DevOps & CI/CD', 'Data & AI', 'Backend', 
    'Security', 'Blockchain', 'Frontend & Web', 'Quantum Computing', 'HPC & Systems'
]);

const TechnologyCategoryBreakdownChart: React.FC<{ technologies: string[] }> = ({ technologies }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipData, setTooltipData] = useState<{ content: string; x: number; y: number } | null>(null);
    const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

    const data = useMemo(() => {
        const categoryCounts = technologies.reduce((acc, tech) => {
            const meta = TECHNOLOGY_METADATA[tech];
            if (meta) {
                acc[meta.category] = (acc[meta.category] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
    }, [technologies]);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const width = 280;
        const height = 280;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .html(""); 

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie<{ name: string; value: number }>()
            .sort(null)
            .value(d => d.value);

        const path = d3.arc<d3.PieArcDatum<{ name: string; value: number }>>()
            .outerRadius(radius - 10)
            .innerRadius(radius - 50);

        const arcs = g.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", path)
            .attr("fill", d => CATEGORY_COLORS(d.data.name))
            .attr("stroke", "#111827") // bg-gray-900
            .style("stroke-width", "2px")
            .style("transition", "opacity 0.2s, transform 0.2s")
            .on("mouseover", function (event, d) {
                setHighlightedCategory(d.data.name);
                setTooltipData({ content: `${d.data.name}: ${d.data.value}`, x: event.clientX, y: event.clientY });
            })
            .on("mousemove", function (event) {
                setTooltipData(prev => (prev ? { ...prev, x: event.clientX, y: event.clientY } : null));
            })
            .on("mouseout", function () {
                setHighlightedCategory(null);
                setTooltipData(null);
            });
            
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .text(`${technologies.length}`)
            .style("font-size", "2.5rem")
            .style("font-weight", "bold")
            .style("fill", "#e5e7eb");
        
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "2.5em")
            .text("Technologies")
            .style("font-size", "0.8rem")
            .style("fill", "#9ca3af");

    }, [data, technologies.length]);

    useEffect(() => {
        if (!svgRef.current) return;
        d3.select(svgRef.current).selectAll('.arc path')
            .transition().duration(200)
            .style('opacity', d => highlightedCategory === null || (d as any).data.name === highlightedCategory ? 1 : 0.3)
            .attr('transform', d => highlightedCategory === (d as any).data.name ? 'scale(1.05)' : 'scale(1)');
    }, [highlightedCategory]);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative">
                <svg ref={svgRef}></svg>
                 {tooltipData && (
                    <div
                        className="fixed p-2 text-xs bg-gray-900 border border-gray-700 text-white rounded-md shadow-lg z-10 pointer-events-none"
                        style={{ top: tooltipData.y, left: tooltipData.x, transform: 'translate(10px, 10px)' }}
                    >
                        {tooltipData.content}
                    </div>
                )}
            </div>
            <ul className="space-y-2 text-sm">
                {data.sort((a,b) => b.value - a.value).map(item => (
                    <li key={item.name} className="flex items-center cursor-pointer" onMouseEnter={() => setHighlightedCategory(item.name)} onMouseLeave={() => setHighlightedCategory(null)}>
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS(item.name) }}></span>
                        <span className="text-gray-400">{item.name}:</span>
                        <span className="font-semibold text-white ml-2">{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const FeatureComplexityChart: React.FC<{ features: string[] }> = ({ features }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltipData, setTooltipData] = useState<{ content: string; x: number; y: number } | null>(null);

    const data = useMemo(() => {
        const getScore = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            return Math.abs(hash);
        };

        return features.map(feature => {
            const baseScore = getScore(feature);
            const complexity = Math.max(1, Math.round((feature.length * (baseScore % 5 + 1)) / 2));
            return { name: feature, value: complexity };
        }).sort((a, b) => a.value - b.value);
    }, [features]);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;

        const container = svgRef.current.parentElement;
        if (!container) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 220 };
        const height = data.length * 35;
        const width = container.clientWidth - margin.left - margin.right;
        
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .html("");

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) || 100])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, height])
            .padding(0.2);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(Math.min(5, d3.max(data, d => d.value) || 1)).tickSizeOuter(0))
            .call(g => g.selectAll(".domain, .tick line").attr("stroke", "#4b5563"))
            .call(g => g.selectAll("text").style("fill", "#9ca3af"));

        g.append("g")
            .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
            .call(g => g.select(".domain").remove())
            .selectAll("text")
            .style("fill", "#e5e7eb")
            .style("font-size", "12px")
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.selectAll('.bar')
                  .filter(barData => (barData as { name: string }).name === d)
                  .attr('fill', '#5eead4');
            })
            .on('mouseout', function(event, d) {
                 d3.selectAll('.bar')
                  .filter(barData => (barData as { name: string }).name === d)
                  .attr('fill', '#2dd4bf');
            });

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", d => y(d.name)!)
            .attr("height", y.bandwidth())
            .attr("fill", "#2dd4bf")
            .attr("width", 0)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#5eead4");
                setTooltipData({ content: `Complexity: ${d.value}`, x: event.clientX, y: event.clientY });
            })
            .on("mousemove", (event) => setTooltipData(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null))
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#2dd4bf");
                setTooltipData(null);
            })
            .transition().duration(800).delay((d, i) => i * 30)
            .attr("width", d => x(d.value));

        svg.append("text")
             .attr("text-anchor", "middle")
             .attr("x", margin.left + width / 2)
             .attr("y", height + margin.top + 35)
             .style("fill", "#9ca3af")
             .style("font-size", "12px")
             .text("Estimated Complexity Score");

    }, [data]);

    return (
        <div className="relative w-full">
            <svg ref={svgRef}></svg>
            {tooltipData && (
                <div
                    className="fixed p-2 text-xs bg-gray-900 border border-gray-700 text-white rounded-md shadow-lg z-10 pointer-events-none"
                    style={{ top: tooltipData.y, left: tooltipData.x, transform: 'translate(10px, -30px)' }}
                >
                    {tooltipData.content}
                </div>
            )}
        </div>
    );
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
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);

    return (
        <section
            ref={ref}
            className={`mb-12 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <h2 className="text-2xl font-bold text-teal-400 mb-4 border-b-2 border-gray-700 pb-2 flex items-center">
                <div className="mr-3 w-7 h-7 flex-shrink-0 flex items-center justify-center">{icon}</div>
                {title}
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300">{children}</div>
        </section>
    );
};

const ProjectInsights: React.FC<ProjectInsightsProps> = ({ project }) => {
    return (
        <>
            <Section title="Technology Category Breakdown" icon={<ChartPieIcon />}>
                <TechnologyCategoryBreakdownChart technologies={project.technologies} />
            </Section>
            
            <Section title="Feature Complexity" icon={<MatrixIcon />}>
                <p className="mb-4">
                    This chart visualizes the estimated complexity of each project feature. Complexity is derived from the feature's name length, combined with a deterministic hash of the name to create a consistent, pseudo-random score. This provides a simple, repeatable metric for relative comparison.
                </p>
                <FeatureComplexityChart features={project.features} />
            </Section>
        </>
    );
};

export default ProjectInsights;