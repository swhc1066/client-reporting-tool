# Git Commands Reference

A practical guide to common git commands and what they do.

---

## Setup and config

| Command | What it does |
|---------|--------------|
| `git init` | Creates a new git repo in the current folder. Run once per project. |
| `git clone <url>` | Copies a remote repo to your machine. Use the repo URL from GitHub/GitLab etc. |
| `git config --global user.name "Name"` | Sets the name used on your commits (global = all repos). |
| `git config --global user.email "email@example.com"` | Sets the email used on your commits. |

---

## Daily workflow

| Command | What it does |
|---------|--------------|
| `git status` | Shows which files are changed, staged, or untracked. Run often. |
| `git add <file>` | Stages a file so it will be included in the next commit. |
| `git add .` | Stages all changed files in the current directory and below. |
| `git commit -m "message"` | Saves staged changes as a new commit with the given message. |
| `git commit -am "message"` | Stages all tracked files that changed and commits in one step. Does not add new (untracked) files. |
| `git push` | Sends your commits to the remote (e.g. origin). |
| `git pull` | Fetches from the remote and merges into your current branch. |

---

## Branches

| Command | What it does |
|---------|--------------|
| `git branch` | Lists local branches. Current branch has an asterisk. |
| `git branch <name>` | Creates a new branch with the given name. Does not switch to it. |
| `git checkout <branch>` | Switches to the given branch. |
| `git checkout -b <name>` | Creates a new branch and switches to it. |
| `git switch <branch>` | Same as checkout for switching branches (newer, clearer command). |
| `git switch -c <name>` | Creates a new branch and switches to it (newer style). |
| `git merge <branch>` | Merges the given branch into your current branch. Run from the branch that should receive the changes. |
| `git branch -d <name>` | Deletes a branch. Fails if it has unmerged changes. |
| `git branch -D <name>` | Force deletes a branch even with unmerged changes. |

---

## Remote and syncing

| Command | What it does |
|---------|--------------|
| `git remote -v` | Lists remotes (usually `origin`) and their URLs. |
| `git fetch` | Downloads new commits from the remote but does not change your working files. |
| `git pull origin <branch>` | Fetches from `origin` for that branch and merges into your current branch. |
| `git push origin <branch>` | Pushes your current branch to `origin`. Use this when pushing a new branch the first time. |
| `git push -u origin <branch>` | Pushes and sets `origin/<branch>` as upstream so future `git push`/`git pull` work without extra args. |

---

## History and inspection

| Command | What it does |
|---------|--------------|
| `git log` | Shows commit history (newest first). Use `q` to quit. |
| `git log --oneline` | Short one-line summary per commit. |
| `git log -n 5` | Shows only the last 5 commits. |
| `git diff` | Shows unstaged changes in your working directory. |
| `git diff --staged` | Shows changes that are staged for the next commit. |
| `git show <commit>` | Shows the changes and message for a specific commit. |

---

## Undoing and fixing

| Command | What it does |
|---------|--------------|
| `git restore <file>` | Discards unstaged changes in that file. File returns to last committed state. |
| `git restore .` | Discards all unstaged changes in the working directory. |
| `git restore --staged <file>` | Unstages a file. Changes stay in the file; they are no longer staged. |
| `git reset --soft HEAD~1` | Undoes the last commit but keeps your changes staged. |
| `git reset --mixed HEAD~1` | Undoes the last commit and unstages the changes. Changes stay in your files. |
| `git reset --hard HEAD~1` | Undoes the last commit and deletes those changes. Use with care. |
| `git revert <commit>` | Creates a new commit that reverses a given commit. Safe for shared history. |

---

## Stashing

| Command | What it does |
|---------|--------------|
| `git stash` | Saves your uncommitted changes and cleans the working directory so you can switch branches. |
| `git stash list` | Lists stashes. |
| `git stash pop` | Applies the most recent stash and removes it from the stash list. |
| `git stash apply` | Applies the most recent stash but keeps it in the stash list. |

---

## Quick reference: typical flow

1. **Start work:** `git pull` then `git checkout -b feature/my-feature`
2. **While working:** `git status`, `git add .`, `git commit -m "Describe change"`
3. **Share work:** `git push -u origin feature/my-feature` then open a pull/merge request
4. **After merge:** `git checkout main`, `git pull`, optionally `git branch -d feature/my-feature`

---

*Tip: Use `git <command> --help` or `git help <command>` for full documentation.*
