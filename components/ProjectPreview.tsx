import React from 'react';
import ReactDOM from 'react-dom';
import type { Project } from '../types';
import { CheckCircleIcon } from './Icons';

interface ProjectPreviewProps {
  project: Project;
  position: { top: number; left: number };
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, position }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed z-50 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-80 text-sm"
      style={{ top: position.top, left: position.left, transform: 'translate(10px, -50%)' }}
    >
      <h3 className="font-bold text-base text-teal-400 mb-2">{project.name}</h3>
      <p className="text-gray-400 text-xs mb-3">{project.description}</p>
      {project.key_takeaways && project.key_takeaways.length > 0 && (
        <>
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mt-3 mb-2">Key Takeaways</h4>
          <ul className="space-y-2">
            {project.key_takeaways.slice(0, 3).map((takeaway, index) => (
              <li key={index} className="flex items-start text-gray-300">
                <CheckCircleIcon />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>,
    document.body
  );
};

export default ProjectPreview;
