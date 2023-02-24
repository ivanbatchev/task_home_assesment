const cookieParser = require("cookie-parser");
const express = require("express");
const R = require("ramda");
const {
  changelogIdToSortable,
  getChangelogContent,
  getChangelogs,
  isChangelogOlder,
} = require("./changelog");

const app = express();

app.use(cookieParser());

app.get("/api/unread-changelog-count", (req, res) => {
  const lastReadChangelogId = req.cookies.LAST_READ_CHANGELOG_ID;
  const changelogs = R.sortBy(
    (changelog) => changelogIdToSortable(changelog.id),
    getChangelogs()
  );
  const lastChangelog = R.last(changelogs);
  if (!lastChangelog) {
    console.warn("No changelogs founds.");
    return res.json({ unreadCount: 0 });
  }

  if (!lastReadChangelogId) {
    res.cookie("LAST_READ_CHANGELOG_ID", lastChangelog.id);

    // New users should not receive alerts about all changelogs prior to their registration.
    return res.json({ unreadCount: 0 });
  }

  const unreadCount = changelogs.filter((changelog) => {
    return isChangelogOlder(lastReadChangelogId, changelog.id);
  }).length;

  return res.json({ unreadCount });
});

app.get("/api/unread-changelog", (req, res) => {
  const lastReadChangelogId = req.cookies.LAST_READ_CHANGELOG_ID;
  if (!lastReadChangelogId) {
    // We treat new users as if they already read all changelogs prior to their registration.
    return res.sendStatus(404);
  }

  const changelogs = R.sortBy(
    (changelog) => changelogIdToSortable(changelog.id),
    getChangelogs()
  );
  const unreadChangelogs = changelogs.filter((changelog) => {
    return isChangelogOlder(lastReadChangelogId, changelog.id);
  });
  if (unreadChangelogs.length === 0) {
    return res.sendStatus(404);
  }

  const firstUnreadChangelog = R.first(unreadChangelogs);
  const changelogContent = getChangelogContent(firstUnreadChangelog);
  res.cookie("LAST_READ_CHANGELOG_ID", firstUnreadChangelog.id);
  return res.send(changelogContent);
});

module.exports = {
  app,
};
