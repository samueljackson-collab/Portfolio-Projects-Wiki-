import fs from 'fs';

const filePath = './constants.ts';
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('export const ALL_PROJECTS_DATA: Project[] = [');
const endIndex = content.indexOf('];', startIndex);
let arrayContent = content.substring(startIndex, endIndex);

const lines = arrayContent.split('\n');
const missing = {
  readme: [],
  adr: [],
  threatModel: [],
  cicdWorkflow: [],
  roadmap: [],
  adrs: []
};

for (const line of lines) {
    if (line.includes('{ "id": ')) {
        const idMatch = line.match(/"id":\s*(\d+)/);
        if (idMatch) {
            const id = idMatch[1];
            for (const field of Object.keys(missing)) {
                if (!line.includes(`"${field}":`)) {
                    missing[field].push(id);
                }
            }
        }
    }
}

console.log("Missing fields summary:");
for (const [field, ids] of Object.entries(missing)) {
    console.log(`${field} missing in projects: ${ids.join(', ')}`);
}
