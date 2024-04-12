#!/usr/bin/env bash

set -e

echo "[ Committify ] Building extension"

rm -rf release
mkdir release

echo "[ Committify ] Building JS and CSS"
npm run js:build
npm run css:build

echo "[ Committify ] Copying files to release folder"
cp application.js release/application.js

mkdir release/popup
cp popup/index.html release/popup/index.html
cp popup/popup.js release/popup/popup.js
cp popup/popup.css release/popup/popup.css

cp manifest.json release/manifest.json

cd release

npx web-ext build

cd ..

echo "[ Committify ] Extension built successfully"
