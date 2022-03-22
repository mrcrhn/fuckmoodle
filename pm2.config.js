module.exports = {
  apps: [
    {
      script: "./lib/index.js",
      name: "fuckmoodle",
      node_args: "-r dotenv/config",
    },
  ],
}
