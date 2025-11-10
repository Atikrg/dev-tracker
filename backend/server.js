require("dotenv").config();
const app = require("./app");

const morgan = require("morgan");

app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

app.get("/", ()=>{
    console.info("Server is running");
})

app.listen(PORT, () => {
  console.info("Server listening at port " + PORT);
});
