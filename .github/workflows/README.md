# GitHub Actions Workflows

This directory contains automated workflows for GitFolio AI.

## Workflows

### 1. Update Portfolio Daily (`update.yml`)

**Triggers:**
- Daily at midnight UTC (cron schedule)
- Manual dispatch via GitHub Actions UI
- Push to main branch (for backend changes)

**What it does:**
1. Checks out the repository
2. Sets up Python environment
3. Installs backend dependencies
4. Runs GitHub profile analyzer
5. Generates charts and visualizations
6. Commits updated data to repository
7. Deploys to Vercel or GitHub Pages

**Required Secrets:**
- `GH_TOKEN` - GitHub Personal Access Token with repo access
- `DEFAULT_USERNAME` - Default GitHub username to analyze
- `VERCEL_TOKEN` - (Optional) Vercel deployment token
- `VERCEL_ORG_ID` - (Optional) Vercel organization ID
- `VERCEL_PROJECT_ID` - (Optional) Vercel project ID

### 2. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Pull requests to main
- Push to main branch

**What it does:**
1. Runs backend linting and tests
2. Builds frontend application
3. Runs frontend linting

### 3. Deploy to Vercel (`deploy.yml`)

**Triggers:**
- After successful portfolio update
- Manual dispatch

**What it does:**
1. Builds Next.js application
2. Deploys to Vercel production

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `read:user`, `user:email`
4. Copy the token

### 2. Add Repository Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:

```
GH_TOKEN=your_github_personal_access_token
DEFAULT_USERNAME=your_github_username
```

### 3. Optional: Setup Vercel Deployment

If deploying to Vercel:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login`
3. Link project: `cd frontend && vercel link`
4. Get token from: https://vercel.com/account/tokens

Add Vercel secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### 4. Optional: Setup GitHub Pages

If using GitHub Pages:

1. Go to repository Settings → Pages
2. Set source to `gh-pages` branch
3. The workflow will auto-deploy

## Manual Trigger

You can manually trigger the update workflow:

1. Go to Actions tab
2. Select "Update Portfolio Daily"
3. Click "Run workflow"
4. (Optional) Enter a GitHub username
5. Click "Run workflow" button

## Monitoring

Check workflow runs in the Actions tab to monitor:
- Execution status
- Logs and errors
- Deployment results

## Customization

### Change Update Frequency

Edit the cron schedule in `update.yml`:

```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at midnight
  # - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 0 * * 1'  # Weekly on Monday
```

### Analyze Multiple Users

Modify the analyzer script to loop through multiple usernames.

### Add Notifications

Add steps to send notifications (Slack, Discord, email) on completion.
