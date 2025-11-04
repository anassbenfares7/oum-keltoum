# 🔄 Backup & Recovery Guide

This guide explains how to use the version control system set up for the Oum Keltoum Restaurant Website project.

## 📁 Files Created

### 1. Git Repository
- **`.git/`**: Git repository with all project history
- **`.gitignore`**: Files that should not be tracked (node_modules, etc.)

### 2. Git Hooks
- **`.git/hooks/pre-commit`**: Automatically stages changes and creates commits
- **`.git/hooks/post-commit`**: Logs commits and creates backup tags

### 3. Backup Scripts
- **`backup-script.sh`**: Full-featured backup and recovery tool
- **`simple-backup.sh`**: Quick backup script for daily use

## 🚀 How to Use

### Quick Backup (Recommended for daily use)
```bash
./simple-backup.sh
```
This will:
1. Check for any changes
2. Add all files to staging
3. Create a backup commit with timestamp
4. Show the commit details

### Full Backup Tool (For advanced recovery)
```bash
./backup-script.sh
```
This interactive tool provides:
1. **Status Check**: See current git status
2. **Create Backup**: Manual backup point
3. **Show History**: View recent commits
4. **Revert to Commit**: Go back to specific version
5. **Safety Branch**: Create backup branch
6. **Restore from Safety**: Restore from backup branch

### Manual Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Create commit
git commit -m "Your message here"

# View history
git log --oneline

# Revert to specific commit
git reset --hard <commit-hash>

# Create branch
git branch <branch-name>

# Switch branch
git checkout <branch-name>
```

## 🔄 Automatic Backups

The system is configured to automatically:
1. **Create commits** when you run `git commit`
2. **Log commit history** in `.git/commit-log.txt`
3. **Create backup tags** every 10 commits
4. **Show commit summaries** after each commit

## 🛡️ Safety Features

### 1. Multiple Backup Points
- **Commits**: Every change is tracked
- **Branches**: Create safety branches for major changes
- **Tags**: Automatic backup tags every 10 commits

### 2. Recovery Options
- **Revert to commit**: Go back to any previous version
- **Branch restore**: Restore from safety branches
- **Tag restore**: Restore from automatic backup points

### 3. Change Tracking
- **File history**: See all changes to every file
- **Commit messages**: Clear descriptions of what changed
- **Timestamps**: Know when each change was made

## 📊 Backup Strategy

### Before Making Changes
1. Run `./simple-backup.sh` to create a backup point
2. Make your changes
3. Run `./simple-backup.sh` again to save your work

### Before Major Updates
1. Create a safety branch using `./backup-script.sh`
2. Make your major changes
3. Test thoroughly
4. Merge back to main branch if successful
5. Revert from safety branch if problems occur

### Regular Maintenance
- **Daily**: Run `./simple-backup.sh` after making changes
- **Weekly**: Check `./backup-script.sh` option 3 to review history
- **Monthly**: Review commit log and clean up old branches if needed

## 🔧 Troubleshooting

### No Changes to Commit
If you see "No changes to commit", it means:
- All files are already saved and committed
- No changes have been made since the last backup

### Merge Conflicts
If you encounter merge conflicts:
1. Run `git status` to see conflicted files
2. Open the files and resolve conflicts manually
3. Run `git add .` to mark conflicts as resolved
4. Run `git commit` to complete the merge

### Lost Work
If you need to recover lost work:
1. Run `./backup-script.sh`
2. Choose option 3 to see commit history
3. Choose option 4 to revert to the right commit
4. Or choose option 6 to restore from a safety branch

## 📈 Benefits

This backup system provides:
- **Complete history**: Every change is tracked
- **Easy recovery**: Multiple ways to restore previous versions
- **Automatic protection**: Git hooks and scripts prevent data loss
- **Peace of mind**: You can experiment safely with backups

## 🆘 Emergency Recovery

If you encounter serious issues:
1. **Don't panic**: Your work is safely stored in git
2. **Run the backup tool**: `./backup-script.sh`
3. **Check available options**: Use status and history commands
4. **Restore from backup**: Choose the appropriate recovery option
5. **Get help**: Review this guide or check git documentation

---

**Remember**: This system protects your work automatically, but it's always good practice to run `./simple-backup.sh` after making important changes!