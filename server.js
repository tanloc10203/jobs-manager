const app = require("./src/app");
const configs = require("./src/config");

const PORT = configs.port;

const server = app.listen(PORT, () =>
  console.log(`server on http://localhost:${PORT}`)
);

process.on("SIGINT", () => {
  server.close(() => console.log("Exits server."));
});
