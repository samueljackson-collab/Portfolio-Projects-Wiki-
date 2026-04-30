import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide details on generating Github Pages 

console.log("To create each wiki page on GitHub Pages:");
console.log("1. Go to your GitHub repository -> Settings -> Pages");
console.log("2. Set 'Source' to 'GitHub Actions' or select your 'docs' folder.");
console.log("3. If using VitePress or Jekyll, ensure you configure it to read from 'docs/'.");
console.log("4. Alternatively, just push standard markdown files to your repo's 'docs/' folder and enable GitHub Pages on it.");
console.log("5. GitHub's built-in Wiki tab can also be used by cloning the wiki repo locally and pasting these markdowns.");

console.log("\\nGenerating markdown pages locally...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In TS environment, it's easier to read constants from typescript compiler, or run this via tsx
// Let's assume this script is run via `npx tsx scripts/exportWiki.ts`

const exportWiki = async () => {
  const { ALL_PROJECTS_DATA } = await import('../constants.ts');
  const targetDir = path.join(__dirname, '..', 'docs', 'projects');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  ALL_PROJECTS_DATA.forEach(project => {
    let md = \`# \${project.name}

**Status:** \${project.status} | **Completion:** \${project.completion_percentage}%

## Description
\${project.description}

## Key Features
\${project.features?.map(f => \`- \${f}\`).join('\\n')}

## Technologies
\${project.technologies?.join(', ')}

\`;

    if (project.live_demo_url) {
      md += \`**[Live Demo](\${project.live_demo_url})**\\n\\n\`;
    }

    if (project.documentation_url) {
      md += \`**[Documentation](\${project.documentation_url})**\\n\\n\`;
    }

    if (project.readme) {
      md += \`## README\\n\\n\${project.readme}\\n\\n\`;
    }

    if (project.adrs && project.adrs.length > 0) {
      md += \`## Architecture Decisions\\n\\n\`;
      project.adrs.forEach(adr => {
        md += \`### \${adr.title} (\${adr.status})\\n\`;
        md += \`- **Context:** \${adr.context}\\n\`;
        md += \`- **Decision:** \${adr.decision}\\n\`;
        if (adr.consequences) {
          md += \`- **Consequences:** \${adr.consequences}\\n\`;
        }
        md += \`\\n\`;
      });
    } else if (project.adr) {
      md += \`## Architecture Decisions\\n\\n\${project.adr}\\n\\n\`;
    }

    if (project.threatModel) {
      md += \`## Threat Model\\n\\n\${project.threatModel}\\n\\n\`;
    }

    const filepath = path.join(targetDir, \`\${project.slug}.md\`);
    fs.writeFileSync(filepath, md, 'utf-8');
    console.log(\`✅ Exported docs/projects/\${project.slug}.md\`);
  });
  
  
  // Create an index file
  let indexMd = \`# Projects Wiki\\n\\nWelcome to the projects wiki!\\n\\n\`;
  ALL_PROJECTS_DATA.forEach(project => {
    indexMd += \`- [\${project.name}](projects/\${project.slug}.md)\\n\`;
  });
  fs.writeFileSync(path.join(targetDir, '..', 'index.md'), indexMd, 'utf-8');
  console.log(\`✅ Exported docs/index.md\`);
};

exportWiki().catch(console.error);
