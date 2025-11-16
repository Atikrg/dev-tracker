require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res)=>{
    console.info("Server is running");
    res.send("Server is listening")

})

app.listen(PORT, () => {
  console.info("Server listening at port " + PORT);
});
