// src/scripts/init-folders.ts
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export function initFolders() {
  const folders = ['profils', 'temp'];
  
  folders.forEach(folder => {
    const folderPath = join(process.cwd(), folder);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
      console.log(`Dossier créé: ${folderPath}`);
    }
  });
}

// Appelez cette fonction dans votre main.ts
