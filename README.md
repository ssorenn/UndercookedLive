# Contribution Workflow

To keep the project organized and easy to collaborate on, we follow this workflow for all development. (although our project is simple right now, this is best practice as it gets larger)

# Issue Assignment

- You must be added to a GitHub Issue before starting on a branch

- If you want to work on something, comment on the issue or just ask to be assigned

# Branching Rules

- ** Do not work directly on main **

- Every issue should have its ** own branch **

- All branches must start with feature/

Example:

git checkout -b feature/home-screen-ui (example for issue 1)
Making Changes

# Making Changes 

- Make semi-descriptive commits so it’s clear what’s happening

- Avoid vague messages like update or fix

Good examples:

git commit -m "add home screen background layout"
git commit -m "style play, settings, and info buttons"
 # Pushing Changes
git push origin feature/home-screen-ui
 
# Pull Requests

- Open a ** Pull Request (PR) ** from your feature/* branch → main

- Reference the related issue in the PR description (e.g. Closes #12)

- PRs must be reviewed before merging

- Do not merge your own PR unless explicitly allowed

# Keeping Your Branch Up to Date

Before starting work or if main changes:

git checkout main
git pull origin main
git checkout feature/your-branch-name
git merge main