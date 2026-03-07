# Before running this script, you should have commited the changes from main branch

#!/bin/bash

# Stop the script if one command returns an error
set -e

echo "Start deploy"

# Change branch and sync changes from main to gh-pages
git checkout gh-pages
git merge main --no-edit

# Bundle production application into dist
npm run build

# Force add dist (compiled files) commit stage and commit changes 
git add dist -f
git commit

# Push to GitHub gh-pages branch only the dist directory as the root
git subtree push --prefix dist origin gh-pages

# Change back to main branch
git checkout main

echo "Deploy done!"