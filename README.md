# Configuration

App is set up using environment variables. You can specify them in the `.env` file or `.env.local` for local modifications.
Vars that are related to the server executable are started with `SERVER_`, eg `SERVER_CHANGELOG_URL`.

# Server

Server takes the list of changelogs from the `data` directory. To fetch the new changelog, run `npm run fetch-changelog`.
It will download a changelog from `SERVER_CHANGELOG_URL` and put it into `data` directory.

Then you shall run the server with `npm run server`.
