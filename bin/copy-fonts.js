#!/usr/bin/env node
import { copyFonts } from '../index.js';
import path from 'path';

if (process.argv < 4) {
  console.error('Usage: node copy-fonts <source> <destination> [--watch|-w] [--verbose|-v]');
  process.exit(1);
}

const args = process.argv.slice(2);

const watchIndex = args.indexOf('--watch') !== -1 ? args.indexOf('--watch') : args.indexOf('-w');
const verboseIndex = args.indexOf('--verbose') !== -1 ? args.indexOf('--verbose') : args.indexOf('-v');

const watch = watchIndex !== -1;
const verbose = verboseIndex !== -1;

if (watch) args.splice(watchIndex, 1);
if (verbose) args.splice(verboseIndex, 1);

const srcArg = args[0];
const destArg = args[1];

const srcPath = path.resolve(process.cwd(), srcArg);
const destPath = path.resolve(process.cwd(), destArg);

copyFonts(srcPath, destPath, watch, verbose);