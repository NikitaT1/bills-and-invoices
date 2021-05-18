const db = require("../db");

(async () => {
  try {
    await db("name").insert({});
    await db("users").insert({ name: "Jane Doe" });
    console.log("Added dummy users!");
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
