# copy-fonts

Tiny cross-platform folder copy command-line utility (CLI) with watch mode.

## Install

```bash
npm install copy-fonts --save-dev
```

## Usage

```bash
copy-fonts <source> <destination> [--watch|-w] [--verbose|-v]
```

## Example

```bash
npx copy-fonts src dist --watch --verbose
```
or
```json
"scripts": {
  "build:assets": "copy-fonts src dist",
  "dev:assets": "copy-fonts src dist -w -v",
}
```