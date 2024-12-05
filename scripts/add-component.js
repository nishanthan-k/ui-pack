#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get component name from command line arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error('Please specify a component name.');
  process.exit(1);
}

// Source directory in the ui-pack package
const srcDir = path.join(__dirname, '../src/ui');

// Determine if the project is using React or Next.js
function getProjectType() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = require(packageJsonPath);
  const dependencies = packageJson.dependencies || {};
  
  if (dependencies['next']) {
    return 'next';
  } else if (dependencies['react']) {
    return 'react';
  }

  return null;
}

// Get the destination directory based on the project type
const projectType = getProjectType();
let destDir;

if (projectType === 'next') {
  destDir = path.join(process.cwd(), 'ui', componentName + '.js');
} else if (projectType === 'react') {
  destDir = path.join(process.cwd(), 'src/ui', componentName + '.js');
} else {
  console.error('Could not detect React or Next.js. Exiting.');
  process.exit(0);
}

// Check if the requested component exists
const componentSrc = path.join(srcDir, `${componentName}.js`);
if (fs.existsSync(componentSrc)) {
  fs.copyFileSync(componentSrc, destDir);
  console.log(`Component ${componentName} copied to the appropriate folder.`);
} else {
  console.error(`Component ${componentName} does not exist in ui-pack.`);
}
