// scripts/update-readme.js
//
// Fetches the user's public, non-fork repos from the GitHub API, picks the
// top 4 by (stars, then most-recently-pushed), and rewrites the section of
// README.md between the PROJECTS:START / PROJECTS:END markers. Also stamps
// a "last synced" timestamp between LAST_SYNCED:START / LAST_SYNCED:END.
//
// Designed to run inside GitHub Actions (uses GITHUB_TOKEN + GITHUB_REPOSITORY
// env vars that Actions provides automatically), but also works locally if
// you export GITHUB_TOKEN and GITHUB_REPOSITORY yourself.

const fs = require("fs");
const path = require("path");

const README_PATH = path.join(__dirname, "..", "README.md");

const [owner] = (process.env.GITHUB_REPOSITORY || "Prakhar1Ojha/Prakhar1Ojha").split("/");
const TOKEN = process.env.GITHUB_TOKEN;

const MAX_PROJECTS = 4;
const EXCLUDE_REPOS = new Set([owner.toLowerCase()]); // skip the profile repo itself

async function fetchRepos() {
  const headers = {
    "User-Agent": "profile-readme-bot",
    Accept: "application/vnd.github+json",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${owner}/repos?per_page=100&type=owner`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }
  const repos = await res.json();

  return repos
    .filter((r) => !r.fork && !r.archived && !EXCLUDE_REPOS.has(r.name.toLowerCase()))
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    })
    .slice(0, MAX_PROJECTS);
}

function tagsFor(repo) {
  const tags = [];
  if (repo.language) tags.push(repo.language);
  if (repo.stargazers_count > 0) tags.push(`★ ${repo.stargazers_count}`);
  if (repo.topics && repo.topics.length) tags.push(...repo.topics.slice(0, 2));
  return tags.length ? tags.map((t) => `\`${t}\``).join(" ") : "`Project`";
}

function buildTable(repos) {
  if (!repos.length) {
    return "_No public repositories found yet — push something and re-run this workflow!_";
  }

  const cells = repos.map((repo) => {
    const desc = repo.description
      ? repo.description.trim()
      : "No description provided yet.";
    return `<td width="50%">

### [${repo.name}](${repo.html_url})
${desc}

${tagsFor(repo)}

</td>`;
  });

  // pair cells into rows of 2
  const rows = [];
  for (let i = 0; i < cells.length; i += 2) {
    const pair = cells.slice(i, i + 2);
    rows.push(`<tr>\n${pair.join("\n")}\n</tr>`);
  }

  return `<table>\n${rows.join("\n")}\n</table>`;
}

function replaceBetweenMarkers(content, startMarker, endMarker, replacement) {
  const pattern = new RegExp(
    `${startMarker}[\\s\\S]*?${endMarker}`,
  );
  if (!pattern.test(content)) {
    throw new Error(`Markers ${startMarker} / ${endMarker} not found in README.md`);
  }
  return content.replace(pattern, `${startMarker}\n${replacement}\n${endMarker}`);
}

async function main() {
  let readme = fs.readFileSync(README_PATH, "utf8");

  const repos = await fetchRepos();
  const table = buildTable(repos);
  readme = replaceBetweenMarkers(
    readme,
    "<!-- PROJECTS:START -->",
    "<!-- PROJECTS:END -->",
    table
  );

  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  readme = replaceBetweenMarkers(
    readme,
    "<!-- LAST_SYNCED:START -->",
    "<!-- LAST_SYNCED:END -->",
    `Last auto-synced: ${timestamp}`
  );

  fs.writeFileSync(README_PATH, readme, "utf8");
  console.log(`Updated README.md with ${repos.length} project(s) and timestamp ${timestamp}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
