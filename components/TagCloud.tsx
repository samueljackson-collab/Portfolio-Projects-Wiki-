import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface TagCloudProps {
  technologies: string[];
}

const TagCloud: React.FC<TagCloudProps> = ({ technologies }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || technologies.length === 0) return;

    const width = 500;
    const height = 300;

    const layout = cloud()
      .size([width, height])
      .words(technologies.map(tech => ({ text: tech, size: 10 + Math.random() * 90 })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30)
      .font('Impact')
      .fontSize(d => d.size || 10)
      .on('end', draw);

    layout.start();

    function draw(words: cloud.Word[]) {
      const svg = d3.select(svgRef.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', (d, i) => d3.schemeCategory10[i % 10])
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text || '');
    }
  }, [technologies]);

  return <svg ref={svgRef} />;
};

export default TagCloud;
