const fs = require("fs");
const path = require("path");
const { env } = require("./env");
const nodeFetch = import("node-fetch");

const changelogOutputDir = path.join(__dirname, "../data");
const changelogUrl = env.SERVER_CHANGELOG_URL;

async function downloadChangelog() {
  const fetch = (await nodeFetch).default;
  const res = await fetch(changelogUrl);
  const text = await res.text();
  return text;
}

function calcChangelogFilename(changelogIdentifier) {
  return `changelog-${changelogIdentifier}.md`;
}

function getChangelogId(changelogFilename) {
  return changelogFilename.replace("changelog-", "").replace(".md", "");
}

function saveChangelog({ changelogContent, changelogIdentifier }) {
  const filename = calcChangelogFilename(changelogIdentifier);
  fs.writeFileSync(path.join(changelogOutputDir, filename), changelogContent);
}

function getChangelogs() {
  const changelogFiles = fs.readdirSync(changelogOutputDir);
  return changelogFiles.map((filename) => ({
    filename,
    id: getChangelogId(filename),
  }));
}

// TODO: fix changelog identifier
// Here we assign the date of changelog download as it's identifier.
// This is not ideal and instead the date (or version) of changelog
// should be assumed from more reliable source like file name or file content or through other means.
function calcChangelogId() {
  return new Date().toISOString();
}

/**
 * Currenly our ids are just dates, so we can sort them as dates.
 * If our ids become changelog versions, then we can convert version to
 * some numerical representation that we can sort upon.
 */
function changelogIdToSortable(id) {
  return new Date(id);
}

/**
 * @returns `true` if `a` is older than `b`.
 */
function isChangelogOlder(aId, bId) {
  return changelogIdToSortable(aId) < changelogIdToSortable(bId);
}

function getChangelogContent({ filename }) {
  return fs.readFileSync(filename, "utf8");
}

module.exports = {
  downloadChangelog,
  saveChangelog,
  getChangelogs,
  calcChangelogId,
  changelogIdToSortable,
  isChangelogOlder,
  getChangelogContent,
};
