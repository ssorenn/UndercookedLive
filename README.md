# Contribution Workflow

To keep the project organized and easy to collaborate on, we follow this workflow for all development. (Although our project is simple right now, this is best practice as it gets larger.)

## References

- **Figma:** https://www.figma.com/design/2CxxY17aeZN0Vp5TZLbLmR/cs370?node-id=0-1&p=f&t=tQWHB8oAtV2vqrtI-0

- **Google Drive:** https://drive.google.com/drive/u/3/folders/1Y3yywiI1jm7tH2o58qLoDGq10ukHkLDa

## Issue Assignment

- You must be added to a GitHub Issue before starting on a branch
- If you want to work on something, comment on the issue or just ask to be assigned

## Branching Rules

- **Do not work directly on main**
- Every issue should have its **own branch**
- All branches must start with `feature/`

**Example:**
```bash
git checkout -b feature/home-screen-ui  # example for issue 1
```

## Making Changes

- Make semi-descriptive commits so it's clear what's happening
- Avoid vague messages like "update" or "fix"

**Good examples:**
```bash
git commit -m "add home screen background layout"
git commit -m "style play, settings, and info buttons"
```

## Pushing Changes
```bash
git push origin feature/home-screen-ui
```

## Pull Requests

- Open a **Pull Request (PR)** from your `feature/*` branch → `main`
- Reference the related issue in the PR description (e.g., "Closes #12")
- PRs must be reviewed before merging
- Do not merge your own PR unless explicitly allowed

## Keeping Your Branch Up to Date

Before starting work or if main changes:
```bash
git checkout main
git pull origin main
git checkout feature/your-branch-name
git merge main
```