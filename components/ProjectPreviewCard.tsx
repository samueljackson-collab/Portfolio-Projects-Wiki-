import React from 'react';
import type { Project } from '../types';
import ProgressBar from './ProgressBar';
import { XCircleIcon, CheckCircleIcon } from './Icons';

interface ProjectPreviewCardProps {
  project: Project;
  onClose: () => void;
  isPinned: boolean;
}

const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({ project, onClose, isPinned }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 flex items-center justify-center animate-fade-in-fast" onClick={onClose}>
      <div className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md m-4 animate-slide-up-fast" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">{project.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close preview">
            <XCircleIcon />
          </button>
        </header>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-gray-400 mb-4">{project.description}</p>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Project Status</h4>
            <div className="flex items-center space-x-4">
                <span className={`inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full`}>{project.status}</span>
                <ProgressBar percentage={project.completion_percentage} />
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Takeaways</h4>
            <ul className="space-y-2">
              {project.key_takeaways?.slice(0, 3).map((takeaway, index) => (
                <li key={index} className="flex items-start text-sm text-gray-300">
                  <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Core Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 5).map(tech => (
                <span key={tech} className="px-2 py-1 text-xs font-medium text-cyan-200 bg-gray-700 rounded-full">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="text-xs text-gray-500">+ {project.technologies.length - 5} more</span>
              )}
            </div>
          </div>
        </div>

        <footer className="p-4 border-t border-gray-700 text-right">
            <p className="text-xs text-gray-500 italic">
                {isPinned ? "Click outside or use 'X' to close." : "Click 'About' to pin this view."}
            </p>
        </footer>
      </div>
    </div>
  );
};

export default ProjectPreviewCard;
