#!/bin/bash

# Simple backup script for Oum Keltoum Restaurant Website
# This script creates a backup commit for all changes

echo "🔧 Oum Keltoum Restaurant Website - Simple Backup Tool"
echo "========================================================="

# Show current status
echo ""
echo "📊 Current Status:"
echo "   Current branch: $(git branch --show-current)"
echo "   Total commits: $(git rev-list --count HEAD)"
echo "   Last commit: $(git log -1 --format='%h - %s')"

# Check if there are any changes
STAGED_FILES=$(git diff --cached --name-only | wc -l)
UNSTAGED_FILES=$(git diff --name-only | wc -l)

echo "   Staged files: $STAGED_FILES"
echo "   Unstaged files: $UNSTAGED_FILES"

# If no changes, exit
if [ $STAGED_FILES -eq 0 ] && [ $UNSTAGED_FILES -eq 0 ]; then
    echo ""
    echo "✅ No changes to commit. Everything is up to date!"
    exit 0
fi

# Add all changes
echo ""
echo "📝 Adding all changes to staging area..."
git add .

# Create backup commit
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
CHANGED_FILES=$(git diff --cached --name-only | wc -l)

git commit -m "Auto-backup: $CHANGED_FILES files changed ($TIMESTAMP)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

echo ""
echo "✅ Backup created successfully!"
echo "   Commit: $(git rev-parse HEAD)"
echo "   Files: $CHANGED_FILES"
echo "   Time: $TIMESTAMP"