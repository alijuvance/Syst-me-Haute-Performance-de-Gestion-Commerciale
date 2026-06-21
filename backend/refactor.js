const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modulesDir = path.join(srcDir, 'modules');
const coreDir = path.join(srcDir, 'core');
const commonDir = path.join(srcDir, 'common');
const configDir = path.join(srcDir, 'config');

const dirsToCreate = [
  modulesDir,
  coreDir,
  commonDir,
  path.join(commonDir, 'decorators'),
  path.join(commonDir, 'filters'),
  path.join(commonDir, 'guards'),
  path.join(commonDir, 'utils'),
  configDir
];

dirsToCreate.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const modules = [
  'analytics', 'auth', 'categories', 'customers', 'depots', 
  'products', 'purchase-orders', 'roles', 'sales', 
  'stock-levels', 'stock-movements', 'stock-transfers', 
  'suppliers', 'users'
];

// Move modules
modules.forEach(mod => {
  const oldPath = path.join(srcDir, mod);
  const newPath = path.join(modulesDir, mod);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
});

// Move prisma
const prismaOld = path.join(srcDir, 'prisma');
const prismaNew = path.join(coreDir, 'prisma');
if (fs.existsSync(prismaOld)) {
  fs.renameSync(prismaOld, prismaNew);
}

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We moved modules from src/X to src/modules/X
  // We moved prisma from src/prisma to src/core/prisma

  // For app.module.ts
  if (filePath.endsWith('app.module.ts')) {
    modules.forEach(mod => {
      const regex = new RegExp(`'./${mod}/`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `'./modules/${mod}/`);
        changed = true;
      }
    });
    if (content.includes("'./prisma/")) {
      content = content.replace(/'\.\/prisma\//g, "'./core/prisma/");
      changed = true;
    }
  }

  // For files inside src/modules/X
  if (filePath.includes(path.sep + 'modules' + path.sep)) {
    // If they imported from another module, e.g., '../users/...' -> '../../modules/users/...' (wait, they are in modules now, so '../users/...' remains '../users/...' ! Because both moved to src/modules!)
    // BUT if they imported from prisma: '../prisma/prisma.service' -> '../../core/prisma/prisma.service'
    if (content.includes("'../prisma/")) {
      content = content.replace(/'\.\.\/prisma\//g, "'../../core/prisma/");
      changed = true;
    } else if (content.includes('"../prisma/')) {
      content = content.replace(/"\.\.\/prisma\//g, '"../../core/prisma/');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      updateImports(fullPath);
    }
  });
}

walkDir(srcDir);
console.log('Refactoring completed successfully.');
