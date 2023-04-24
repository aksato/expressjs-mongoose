import "./lib/db";
import express from "express";
import { NextFunction, Request, Response } from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import * as handlers from "./lib/handlers";

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

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.get("/newsletter-signup", handlers.newsletterSignup);

app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);

app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

// custom 404 page
app.use(handlers.notFound);

// custom 500 page
app.use(handlers.serverError);

app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
      `press Ctrl-C to terminate.`
  )
);
