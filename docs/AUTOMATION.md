# Automation Guide

This repo now has a third workflow — `.github/workflows/auto-update.yml` —
on top of the snake animation and metrics ones. Here's exactly what is and
isn't automatic, and how it works.

## What's now fully automatic

| What | How |
|---|---|
| Featured Projects table | `scripts/update-readme.js` calls the GitHub API for your public repos, picks your top 4 (stars first, then most recently pushed), and rewrites the table between the `<!-- PROJECTS:START -->` / `<!-- PROJECTS:END -->` markers in `README.md`. |
| "Last auto-synced" timestamp | Same script stamps the current UTC time between `<!-- LAST_SYNCED:START -->` / `<!-- LAST_SYNCED:END -->` in the footer, so you can see at a glance when it last ran. |
| Stats / streak / activity graph / trophies / profile views / LeetCode card | Already automatic — these are live `<img>` tags hitting external APIs on every page load. No workflow involved. |
| Snake animation | Already automatic via `snake.yml` (daily cron + push trigger). |

**Trigger conditions for the new workflow:**
- Every push to `main`
- Daily at 06:00 UTC regardless of activity
- Manually anytime from the **Actions** tab

It commits back to `main` with `[skip ci]` in the message so it doesn't trigger an infinite loop of workflow runs.

## What's intentionally still manual

- **About Me, Quick Facts, Tech Stack, Philosophy, Timeline, Goals/Roadmap progress bars, contact links** — these are personal/subjective claims (what you're learning, your goals, your %-complete on something). There's no API that knows these things about you, so automating them would mean either guessing or lying. Edit these by hand when something genuinely changes.
- **LeetCode/Codeforces/etc. progress bars in Roadmap** — could technically be pulled from LeetCode's unofficial API, but it's unauthenticated, rate-limited, and breaks without warning. Left manual for reliability; the LeetCode *card* widget further down already shows live stats safely.

## Setup (one-time)

Nothing extra beyond what's in `docs/SETUP.md` — `auto-update.yml` uses the
default `GITHUB_TOKEN` that Actions provides automatically, no secrets to
create. Just make sure under **Settings → Actions → General → Workflow
permissions** that "Read and write permissions" is selected, or the commit
step won't be able to push.

## Customizing what counts as "featured"

Open `scripts/update-readme.js`:
- `MAX_PROJECTS` — change how many project cards show (default 4)
- The `.sort(...)` comparator — change ranking logic (e.g. sort by `pushed_at` only, ignore stars)
- `EXCLUDE_REPOS` — add repo names (lowercase) you never want auto-featured

## Verifying it's working

After your first push, check the **Actions** tab for an "Auto-Update README"
run. If it's green, look at the bottom of your README — the "Last
auto-synced" line should show a real timestamp instead of "pending first run."
