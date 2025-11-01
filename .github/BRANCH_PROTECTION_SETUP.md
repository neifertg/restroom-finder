# Branch Protection Rules Setup

Follow these steps to set up branch protection rules for the `main` branch on GitHub.

## Setup Instructions

1. **Navigate to Repository Settings**
   - Go to https://github.com/neifertg/VoterEd/settings/branches
   - Or: Repository → Settings → Branches

2. **Add Branch Protection Rule**
   - Click "Add branch protection rule"
   - Branch name pattern: `main`

## Recommended Settings

### Protect matching branches
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1` (increase to 2+ for team projects)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (optional, set up CODEOWNERS file if needed)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Select required status checks:
    - `Lint and Type Check`
    - `Build`
    - `Vercel` (will appear after Vercel deployment)

- ✅ **Require conversation resolution before merging**
  - Ensures all PR comments are resolved

- ✅ **Require linear history**
  - Prevents merge commits, enforces rebase or squash

- ❌ **Require deployments to succeed before merging** (optional)
  - Enable if you want to require successful Vercel preview deployments

### Rules applied to everyone including administrators
- ✅ **Do not allow bypassing the above settings**
  - Ensures even admins follow the rules

- ❌ **Allow force pushes** (Keep disabled for safety)
- ❌ **Allow deletions** (Keep disabled for safety)

## Additional Setup

### Create CODEOWNERS file (optional)
Create `.github/CODEOWNERS` to automatically request reviews from specific people:

```
# Default owner for everything
* @neifertg

# Frontend components
/src/app/ @neifertg
/src/components/ @neifertg

# Configuration files
*.json @neifertg
*.yml @neifertg
```

## Vercel Integration

After deploying to Vercel:
1. Vercel will automatically add deployment status checks to your PRs
2. Go back to branch protection settings
3. Add "Vercel" to required status checks
4. This ensures preview deployments succeed before merging

## Linear Integration

The Linear GitHub integration will:
- Automatically link PRs to Linear issues when you use "Fixes VOT-123" in PR descriptions
- Update issue status when PRs are merged
- Show PR status in Linear

## Testing the Setup

1. Create a new branch: `git checkout -b test/branch-protection`
2. Make a small change and push
3. Try to push directly to `main` - should be blocked
4. Create a PR - should require passing CI checks and approval
5. Merge via PR - should succeed

## Notes

- Branch protection rules only apply to pushes, not to the initial repository setup
- If you're the only developer, you can adjust the approval count to 0 initially
- Status checks will only appear in the dropdown after they've run at least once
