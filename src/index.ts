import "./lib/db";
import express from "express";
import { NextFunction, Request, Response } from "express";
import { engine } from "express-handlebars";

const app = express();
const port = process.env.PORT || 3333;

// configure Handlebars view engine
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);

app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", (req, res) => res.render("home"));

app.get("/about", (req, res) => res.render("about"));

// custom 404 page
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// custom 500 page
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500);
  res.render("500");
});

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  )
);
