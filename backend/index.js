const express = require("express");
const app = express();

function add(a, b) {
  return a + b;
}

// Example route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

module.exports = { app, add };

if (require.main === module) {
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
