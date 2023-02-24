const { app } = require("../app");
const { env } = require("../env");

function main() {
  const port = env.SERVER_PORT;
  app.listen(port, () => console.log(`Server is running on port ${port}.`));
}

main();
