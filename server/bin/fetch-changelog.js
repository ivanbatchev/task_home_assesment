const {
  calcChangelogId,
  downloadChangelog,
  saveChangelog,
} = require("../changelog");

async function main() {
  const changelogContent = await downloadChangelog();
  const changelogIdentifier = calcChangelogId();
  saveChangelog({
    changelogContent,
    changelogIdentifier,
  });
}

main();
