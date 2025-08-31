const express = require("express");
const app = express();
function add(a, b) {
  return a + b;
}

// Example route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

// Listen on Render port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = add;
