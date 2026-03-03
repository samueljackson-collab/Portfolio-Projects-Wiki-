import React from 'react';
import type { RoadmapMilestone } from '../types';
import { CheckCircleIcon } from './Icons';

interface ProjectRoadmapProps {
  roadmap: RoadmapMilestone[];
}

const ProjectRoadmap: React.FC<ProjectRoadmapProps> = ({ roadmap }) => {
  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:w-0.5 after:bg-gray-700 after:left-0">
      {roadmap.map((milestone, index) => (
        <div key={index} className="relative pl-8 py-4">
          <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center ring-8 ring-gray-900">
            <CheckCircleIcon className="w-4 h-4 text-teal-400" />
          </div>
          <h4 className="font-bold text-white">{milestone.title}</h4>
          <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
          <span className="text-xs text-gray-500 mt-2 inline-block">Target: {milestone.target_date}</span>
        </div>
      ))}
    </div>
  );
};

export default ProjectRoadmap;
