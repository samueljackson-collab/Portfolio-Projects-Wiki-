import React from 'react';
import type { RoadmapMilestone } from '../types';

interface RoadmapProps {
  milestones?: RoadmapMilestone[];
}

const Roadmap: React.FC<RoadmapProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30 text-center">
        <p className="text-gray-500 font-medium">No roadmap data available for this project.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 border-l-2 border-gray-700 space-y-8 ml-4">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-[41px] top-1 w-5 h-5 bg-teal-500 rounded-full border-4 border-gray-900 shadow-sm" />
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-teal-500/30 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
              <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
              <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 px-2 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                {milestone.target_date}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
