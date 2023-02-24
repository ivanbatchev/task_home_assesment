import { express } from 'express';
import cookieParser from 'cookie-parser';
import fetch from 'node-fetch';
import { fs } from 'fs';

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Download the latest changelog from the gist
async function downloadChangelog() {
  const res = await fetch('https://gist.githubusercontent.com/mnmlsm/56bd4892b33afbeaa57cebbce81be3ba/raw/688f4b8d9ea0c5ddb32846498a48e09c496175c8/gistfile1.txt');
  const text = await res.text();
  return text;
}

// Endpoint to get the count of unread changelogs
app.get('/api/unread-changelog-count', (req, res) => {
  const lastReadChangelogDate = req.cookies.LAST_READ_CHANGELOG_DATE;
  const changelogFiles = fs.readdirSync('./data');
  const unreadCount = changelogFiles.filter(filename => {
    const changelogDate = new Date(filename.replace('changelog-', '').replace('.md', ''));
    return lastReadChangelogDate ? changelogDate > new Date(lastReadChangelogDate) : false;
  }).length;
  res.json({ unreadCount });
});

// Endpoint to get the latest unread changelog
app.get('/api/unread-changelog', (req, res) => {
  const lastReadChangelogDate = req.cookies.LAST_READ_CHANGELOG_DATE;
  const changelogFiles = fs.readdirSync('./data');
  const unreadChangelogs = changelogFiles.filter(filename => {
    const changelogDate = new Date(filename.replace('changelog-', '').replace('.md', ''));
    return lastReadChangelogDate ? changelogDate > new Date(lastReadChangelogDate) : false;
  }).sort();
  if (unreadChangelogs.length === 0) {
    res.sendStatus(404);
  } else {
    const changelogContent = fs.readFileSync(`./data/${unreadChangelogs[0]}`, 'utf8');
    res.cookie('LAST_READ_CHANGELOG_DATE', new Date(unreadChangelogs[0].replace('changelog-', '').replace('.md', '')));
    res.send(changelogContent);
  }
});

// Download the latest changelog on startup
downloadChangelog().then(changelogContent => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const filename = `changelog-${currentDate}.md`;
  fs.writeFileSync(`./data/${filename}`, changelogContent);
});

app.listen(3000, () => console.log('Server running on port 3000'));