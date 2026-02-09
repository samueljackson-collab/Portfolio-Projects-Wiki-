export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "Production Ready" | "Advanced" | "Substantial" | "In Development" | "Basic";
  completion_percentage: number;
  tags: string[];
  github_path: string;
  technologies: string[];
  features: string[];
  key_takeaways?: string[];
  readme?: string;
  adr?: string;
  threatModel?: string;
  cicdWorkflow?: {
    name: string;
    path: string;
    content: string;
  };
}

export interface KeyConcept {
  description: string;
  code_example?: string;
  lang?: string;
}

export interface TechnologyDeepDive {
  title: string;
  explanation: string;
  key_concepts?: Record<string, string | KeyConcept>;
  real_world_scenario?: string;
  code_example?: string;
  benefits: string[];
  best_practices?: string[];
  anti_patterns?: string[];
  learning_resources: string[];
}

export interface ProblemContext {
    title: string;
    context: string;
    business_impact: string[];
    solution_approach: string[];
    learning_objectives: string[];
}

export interface ArchitectureDefinition {
    title: string;
    layers: Record<string, string>;
    data_flow: string[];
    real_world_scenario: string;
}

export interface TechnologyMetadata {
  tags: string[];
  category: 'Cloud & Infrastructure' | 'DevOps & CI/CD' | 'Data & AI' | 'Backend' | 'Security' | 'Blockchain' | 'Frontend & Web' | 'Quantum Computing' | 'HPC & Systems';
}