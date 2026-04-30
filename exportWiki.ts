import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=========================================");
console.log("To create each wiki page on GitHub Pages:");
console.log("1. Add these exported markdown files to the 'docs/' directory in your repository.");
console.log("2. In your GitHub repository, go to Settings -> Pages.");
console.log("3. Select 'Deploy from a branch' and choose 'main' branch and '/docs' folder.");
console.log("4. Save and wait for GitHub Actions to deploy your site.");
console.log("=========================================\n");

const exportWiki = async () => {
  const { ALL_PROJECTS_DATA } = await import('./constants.ts');
  const targetDir = path.join(__dirname, 'docs', 'projects');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  ALL_PROJECTS_DATA.forEach(project => {
    let md = `# ${project.name}\n\n`;
    md += `**Status:** ${project.status} | **Completion:** ${project.completion_percentage}%\n\n`;
    md += `## Description\n${project.description}\n\n`;
    
    if (project.features && project.features.length) {
      md += `## Key Features\n${project.features.map(f => `- ${f}`).join('\n')}\n\n`;
    }
    if (project.technologies && project.technologies.length) {
      md += `## Technologies\n${project.technologies.join(', ')}\n\n`;
    }
    
    if (project.readme) md += `## README\n\n${project.readme}\n\n`;
    if (project.adr) md += `## Architecture Decisions\n\n${project.adr}\n\n`;
    if (project.threatModel) md += `## Threat Model\n\n${project.threatModel}\n\n`;

    fs.writeFileSync(path.join(targetDir, `${project.slug}.md`), md, 'utf-8');
    console.log(`✅ Exported docs/projects/${project.slug}.md`);
  });

  let indexMd = `# Projects Wiki\n\n`;
  ALL_PROJECTS_DATA.forEach(p => {
    indexMd += `- [${p.name}](projects/${p.slug}.md)\n`;
  });
  fs.writeFileSync(path.join(__dirname, 'docs', 'index.md'), indexMd, 'utf-8');
  console.log(`✅ Exported docs/index.md`);
};

exportWiki().catch(console.error);
