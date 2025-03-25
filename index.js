import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function findCssFilesOfFonts(fileName, fileList = []) {
  const fontImports = extractImportsFromFile(fileName);

  fontImports.forEach(fontImport => {
    const css = require.resolve(fontImport);
    fileList.push(css);
  });
  return fileList;
}

function extractImportsFromFile(fileName) {
  return fs.readFileSync(fileName, 'utf8')
    .split('\n')
    .filter(line => line.startsWith('import'))
    .map(line => line.match(/'([^']+)'/)[1]);
}

function copyFontFolders(fontImport, destDir) {
  const fontPath = require.resolve(fontImport);
  const fontDir = path.join(path.dirname(fontPath), 'files');
  const fontFiles = fs.readdirSync(fontDir);
  const fontDestDir = path.join(destDir, path.basename(fontDir));
  fs.mkdirSync(fontDestDir, { recursive: true });

  fontFiles.forEach(file => {
    const filePath = path.join(fontDir, file);
    const destPath = path.join(fontDestDir, file);
    console.log("Copying:", filePath, destPath);
    fs.copyFileSync(filePath, destPath);
  });
}

function combineSassFiles(declarationFiles, combinedContent) {
  declarationFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    combinedContent += content + '\n';
  });
  return combinedContent;
}

function generateFontsFile(destDir, fontsFile, generatedFontsFile) {
  const fontModules = extractImportsFromFile(fontsFile);
  fontModules.forEach((fontImport) => copyFontFolders(fontImport, destDir));

  const cssFiles = findCssFilesOfFonts(fontsFile);
  const combinedContent = combineSassFiles(cssFiles, '');
  fs.writeFileSync(generatedFontsFile, combinedContent);
}

export function copyFonts(source, destination, watch, verbose) {

  ///
  const viewsDir = path.join(source, 'styles');
  const destDir = path.join(destination, 'styles');
  const watchFlag = process.argv.includes('--watch');
  const fontsFile = path.join(viewsDir, 'fonts.ts');
  const generatedFontsFolder = path.join(viewsDir, 'generated');
  const generatedFontsFile = path.join(generatedFontsFolder, '_fonts.scss');
  fs.mkdirSync(generatedFontsFolder, { recursive: true });
  console.log("Generated folder created:", generatedFontsFolder);
  ///

  const isSourceExists = fs.existsSync(viewsDir);
  if (!watch && !isSourceExists) {
    console.error(`Source path "${source}" does not exist.`);
    process.exit(1);
  }

  if (isSourceExists) {
    try {
      generateFontsFile(destDir, fontsFile, generatedFontsFile);
    } catch (error) {
      console.error('Error compiling SCSS:', error);
    }
  }

  if (watchFlag) {
    const watcher = chokidar.watch(fontsFile, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.on('add', () => {
      try {
        generateFontsFile(destDir, fontsFile, generatedFontsFile);
      } catch (error) {
        console.error('Error compiling SCSS:', error);
      }
    });
    watcher.on('change', () => {
      try {
        generateFontsFile(destDir, fontsFile, generatedFontsFile);
      } catch (error) {
        console.error('Error compiling SCSS:', error);
      }
    });

    console.log('Watching for file changes...');
  }
}
