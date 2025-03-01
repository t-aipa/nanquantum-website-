#!/bin/bash

# NΛN Quantum Website Deployment Script
# Deploys website to GitHub Pages repository

echo "Starting NΛN Quantum Website Deployment"
echo "========================================"

# Variables
REPO_URL="https://github.com/t-aipa/nanquantum-website-"
DEPLOY_DIR=$(pwd)
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if the repo already exists locally
if [ -d .git ]; then
    echo "Git repository already exists. Updating..."
    git pull origin main
else
    echo "Initializing git repository..."
    git init
    git remote add origin $REPO_URL
fi

# Add all files
echo "Adding files to repository..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Website update - $TIMESTAMP"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Deployment complete!"
echo "The website should be accessible at nanquantum.com once DNS propagates."
echo "========================================"
