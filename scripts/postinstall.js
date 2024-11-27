const fs = require('fs');
const path = require('path');

// Source directory in the ui-pack package
const srcDir = path.join(__dirname, '../app/src/ui');

// Function to recursively copy files
function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });  // Create destination folder if it doesn't exist
  }

  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);  // Recursively copy subdirectories
    } else {
      fs.copyFileSync(srcFile, destFile);  // Copy files
    }
  });
}

// Determine if the project is using React or Next.js
function getProjectType() {
  const packageJsonPath = path.join(process.env.INIT_CWD, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = require(packageJsonPath);

  // Check dependencies for React or Next.js
  const dependencies = packageJson.dependencies || {};
  if (dependencies['next']) {
    return 'next';
  } else if (dependencies['react']) {
    return 'react';
  }

  return null;
}

// Determine destination directory based on project type
const projectType = getProjectType();
let destDir;

if (projectType === 'next') {
  destDir = path.join(process.env.INIT_CWD, 'ui');  // For Next.js projects, copy to /ui
  console.log('Detected Next.js project. Copying files to /ui.');
} else if (projectType === 'react') {
  destDir = path.join(process.env.INIT_CWD, 'src/ui');  // For React projects, copy to src/ui
  console.log('Detected React project. Copying files to src/ui.');
} else {
  console.error('Could not detect React or Next.js. Skipping file copy.');
  process.exit(0);
}

// Copy the files if a valid destination is determined
if (fs.existsSync(srcDir)) {
  copyFiles(srcDir, destDir);
  console.log('UI components copied to the appropriate folder.');
} else {
  console.error('Source UI directory does not exist. Skipping copying components.');
}
