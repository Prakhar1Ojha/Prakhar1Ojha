# Setup Guide

## 1. Create the special repository

GitHub profile READMEs only work in a repo with the **exact same name as your username**.

1. Create a new repo: `YOUR_USERNAME/YOUR_USERNAME`
2. Make it **public**
3. Initialize with a README (or push this project into it)

## 2. Drop in this project

```
git clone https://github.com/YOUR_USERNAME/YOUR_USERNAME.git
cd YOUR_USERNAME
# copy everything from this project folder in
git add .
git commit -m "feat: premium profile README"
git push origin main
```

## 3. Replace placeholders

Find-and-replace these across `README.md` and the SVGs (see `docs/CUSTOMIZATION.md` for the full list):

| Placeholder | Replace with |
|---|---|
| `YOUR_USERNAME` | your GitHub username |
| `YOUR_NAME` | your display name |
| `YOUR_EMAIL` | your email |
| `YOUR_LINKEDIN` | your LinkedIn handle |
| `YOUR_TWITTER` | your X/Twitter handle |
| `YOUR_PORTFOLIO` | your portfolio URL |
| `YOUR_RESUME_LINK` | link to your resume |
| `YOUR_LEETCODE` / `YOUR_CODEFORCES` / `YOUR_CODECHEF` / `YOUR_HACKERRANK` | your handles on each platform |

Quickest way (Linux/macOS):

```bash
sed -i 's/YOUR_USERNAME/prakhar1ojha/g' README.md
sed -i 's/YOUR_NAME/Prakhar Ojha/g' README.md
```
(repeat for each placeholder, or do it manually — there are under 20 of them)

## 4. Enable the snake animation workflow

1. Go to **Settings → Actions → General** in your repo and confirm Actions are enabled.
2. Go to the **Actions** tab → run `Generate Snake Animation` manually once (`workflow_dispatch`).
3. This creates an `output` branch with the generated SVG that `README.md` already links to.
4. After that, it re-runs automatically every day via the cron schedule.

## 5. (Optional) Enable the metrics workflow

1. Create a fine-grained **Personal Access Token** with `repo` read access.
2. Add it as a repository secret named `METRICS_TOKEN` (**Settings → Secrets and variables → Actions**).
3. Run the `Generate Metrics` workflow once manually, then let the cron schedule keep it fresh.

## 6. Pin your projects

GitHub → your profile → **Customize your pins** → choose up to 6 repos. These display automatically above the Featured Projects section on your real profile page (the table in this README is a manual backup/fallback for repos you can't pin, like private work).

## 7. Verify rendering

Check the README:
- on github.com (desktop)
- on the GitHub mobile app
- in dark **and** light mode (toggle in GitHub settings) — badges and SVGs here are tuned for dark mode by default; see `docs/CUSTOMIZATION.md` for a light-mode variant note.

---
Next: read `docs/CUSTOMIZATION.md` to swap colors, sections, and widgets.
