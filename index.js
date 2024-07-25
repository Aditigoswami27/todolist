import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "",//add your database name
  password: "", //password associated with it
  port: 0, //add your database's port number
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let items = [];

app.get("/", async(req, res) => {
  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items= result.rows;
    res.render("index.ejs", {
      listTitle:"Today",
      listItems: items,
    });
  } catch(err){
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("INSERT INTO items (title) VALUES($1)",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const itemId = req.body.updatedItemId; // u call it thru the names put in ejs file
  const itemTitle = req.body.updatedItemTitle;
  try{
     await db.query("UPDATE items SET title = $1 WHERE id = $2",
    [itemTitle, itemId]
   );
   res.redirect("/");
  }
   catch(err){
    console.log(err);
   }
});

app.post("/delete", async(req, res) => {
  try{
    const itemId = req.body.deleteItemId;
  await db.query("DELETE FROM items where id = $1",[itemId]);
  res.redirect("/");
}
  catch(err){
    console.log(err);
   }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
