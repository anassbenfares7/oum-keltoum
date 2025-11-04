#!/bin/bash

# Backup and Recovery Script for Oum Keltoum Restaurant Website
# This script helps manage versions and recover from issues

echo "🔧 Oum Keltoum Restaurant Website - Backup & Recovery Tool"
echo "============================================================"

# Function to show current status
show_status() {
    echo ""
    echo "📊 Current Status:"
    echo "   Current branch: $(git branch --show-current)"
    echo "   Total commits: $(git rev-list --count HEAD)"
    echo "   Last commit: $(git log -1 --format=%h - %s)"
    echo "   Staged files: $(git diff --cached --name-only | wc -l)"
    echo "   Unstaged files: $(git diff --name-only | wc -l)"
}

# Function to create backup point
create_backup() {
    echo ""
    echo "💾 Creating backup point..."

    # Add all changes
    git add .

    # Create backup commit
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "Backup: Manual backup point ($TIMESTAMP)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

    echo "✅ Backup created successfully!"
    show_status
}

# Function to show commit history
show_history() {
    echo ""
    echo "📜 Recent Commit History:"
    git log --oneline -10
}

# Function to revert to specific commit
revert_to_commit() {
    echo ""
    echo "🔄 Available commits to revert to:"
    git log --oneline -20

    echo ""
    read -p "Enter commit hash to revert to: " COMMIT_HASH

    if git rev-parse "$COMMIT_HASH" >/dev/null 2>&1; then
        git reset --hard "$COMMIT_HASH"
        echo "✅ Successfully reverted to commit $COMMIT_HASH"
        show_status
    else
        echo "❌ Invalid commit hash: $COMMIT_HASH"
    fi
}

# Function to create safety branch
create_safety_branch() {
    echo ""
    echo "🛡️  Creating safety branch..."

    TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
    BRANCH_NAME="safety-backup-$TIMESTAMP"

    git checkout -b "$BRANCH_NAME"
    echo "✅ Safety branch '$BRANCH_NAME' created!"
    echo "   Current files are preserved in this branch."
}

# Function to restore from safety branch
restore_from_safety() {
    echo ""
    echo "🔍 Available safety branches:"
    git branch | grep safety

    echo ""
    read -p "Enter safety branch name to restore from: " BRANCH_NAME

    if git rev-parse "$BRANCH_NAME" >/dev/null 2>&1; then
        git checkout main
        git merge "$BRANCH_NAME"
        echo "✅ Successfully restored from safety branch!"
        show_status
    else
        echo "❌ Invalid branch name: $BRANCH_NAME"
    fi
}

# Function to show help
show_help() {
    echo ""
    echo "📖 Available Commands:"
    echo "   1) Show current status"
    echo "   2) Create backup point"
    echo "   3) Show commit history"
    echo "   4) Revert to specific commit"
    echo "   5) Create safety branch"
    echo "   6) Restore from safety branch"
    echo "   7) Exit"
}

# Main menu
while true; do
    echo ""
    echo "🍽️  Oum Keltoum Restaurant Website - Version Control"
    echo "=================================================="
    show_help

    echo ""
    read -p "Enter your choice (1-7): " choice

    case $choice in
        1) show_status ;;
        2) create_backup ;;
        3) show_history ;;
        4) revert_to_commit ;;
        5) create_safety_branch ;;
        6) restore_from_safety ;;
        7) echo "👋 Goodbye!"; exit 0 ;;
        *) echo "❌ Invalid choice. Please enter 1-7." ;;
    esac

    echo ""
    read -p "Press Enter to continue..."
    echo ""
done