# Customization Guide

## File map

```
README.md                          → the profile page itself
assets/svg/banner.svg               → hero banner (edit text/colors directly, it's plain SVG)
assets/svg/footer-wave.svg          → footer wave divider
.github/workflows/snake.yml         → daily contribution-snake generator
.github/workflows/metrics.yml       → optional rich metrics panel generator
docs/SETUP.md                       → first-time setup steps
docs/CUSTOMIZATION.md               → this file
```

## Color palette

The accent color used throughout (badges, SVGs, stats themes) is `#8B8BFF` (soft indigo) paired with `#56CCF2` (cyan) on a `#0D1117` (GitHub dark) background. To rebrand:

1. Swap `8B8BFF` → your accent hex in: `banner.svg`, `footer-wave.svg`, and every `theme=dark&...color=8B8BFF`-style query string in `README.md`.
2. Keep `bg_color=0D1117` if you want it to blend with GitHub's native dark theme; use `bg_color=ffffff` for a light variant.

## Swapping widgets

All dynamic widgets are just images pointed at public APIs — no build step required:

| Widget | Source | Edit by changing |
|---|---|---|
| Typing header | `readme-typing-svg.demolab.com` | `lines=` param (URL-encoded, `;` separated) |
| Stats card | `github-readme-stats.vercel.app` | `username=`, `theme=`, colors |
| Streak stats | `streak-stats.demolab.com` | `user=`, colors |
| Activity graph | `github-readme-activity-graph.vercel.app` | `username=`, `theme=` |
| Trophies | `github-profile-trophy.vercel.app` | `username=`, `theme=` |
| Profile views | `komarev.com/ghpvc` | `username=`, `label=` |
| LeetCode card | `leetcard.jacoblin.cool` | your LeetCode handle in the path |

If any third-party widget service goes down (these are community-run, occasionally rate-limited or unstable), the safest fallback is to temporarily remove that `<img>` line — nothing else in the README depends on it.

## Adding a new section

Copy this pattern and drop it wherever you like in `README.md`:

```markdown
## ⟁ Section Title

Your content here.
```

The `⟁` glyph is used as a consistent section marker for visual rhythm — swap it for nothing, an emoji, or another glyph if you prefer.

## Adding a new featured project

Duplicate one `<td>` block inside the Featured Projects `<table>` and update the link, title, description, and tags.

## Light mode note

GitHub renders README images as-is regardless of viewer theme, so badges/widgets tuned for dark backgrounds can look low-contrast on light mode. Two options:
- Accept it (most premium profiles optimize for dark mode only, since that's GitHub's default for most active developers).
- Maintain a second set of light-themed widget URLs (`theme=light`, `bg_color=ffffff`) and use `<picture>`/`prefers-color-scheme` media-aware images — GitHub README support for this is partial, so test before relying on it.

## Updating the Roadmap progress bars

The `Roadmap & Goals` section includes an ASCII progress-bar block — the numbers/percentages are placeholders. Update them by hand as you go (no automation, by design, so they reflect what's actually true). Each bar is 23 characters: count filled (`█`) vs empty (`░`) blocks proportional to your percentage, e.g. 35% ≈ 8 filled / 15 empty.

## Maintenance checklist (do this every few months)



- [ ] Update **Quick Facts** (`currentFocus`, `currentlyLearning`)
- [ ] Update **Featured Projects** with your newest/best work
- [ ] Update **Timeline** and **Roadmap**
- [ ] Confirm the snake + metrics workflows are still running green (Actions tab)
- [ ] Check for broken images (dead third-party widgets do happen occasionally)

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Snake SVG doesn't show | Workflow never ran, or `output` branch missing | Run `Generate Snake Animation` manually from Actions tab |
| Stats card shows "user not found" | `username=` placeholder not replaced | Re-check every widget URL for leftover `YOUR_USERNAME` |
| Metrics workflow fails | Missing/expired `METRICS_TOKEN` secret | Regenerate PAT, update the repo secret |
| Images broken on mobile | Usually a transient CDN issue with the widget host | Wait/retry; these are external services, not part of this repo |
| README looks cluttered | Too many sections enabled at once | Trim to the sections most relevant to your stage (student vs senior engineer) |
