import "./lib/db";
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import expressSession from "express-session";
import { sessionOptions } from "./lib/session";
import * as handlers from "./lib/handlers";
import { createAuth } from "./lib/auth";
import { IUser } from "./models/user";
declare module "express-session" {
  interface SessionData {
    authRedirect: string;
  }
}

declare global {
  namespace Express {
    interface User {
      user: IUser | null;
    }
  }
}

if (!process.env.FACEBOOK_APP_ID) {
  throw new Error("Please add the FACEBOOK_APP_ID environment variable");
}
if (!process.env.FACEBOOK_APP_SECRET) {
  throw new Error("Please add the FACEBOOK_APP_SECRET environment variable");
}

const app = express();
const port = process.env.PORT || 3333;

// configure Handlebars view engine
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
  })
);

const auth = createAuth(app, {
  // baseUrl is optional; it will default to localhost if you omit it;
  // it can be helpful to set this if you're not working on
  // your local machine. For example, if you were using a staging server,
  // you might set the BASE_URL environment variable to
  // https://staging.meadowlark.com
  baseUrl: process.env.BASE_URL,
  providers: {
    facebook: {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
    },
  },
  successRedirect: "/account",
  failureRedirect: "/unauthorized",
});

// auth.init() links in Passport middleware:
auth.init();
// now we can specify our auth routes:
auth.registerRoutes();

app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession(sessionOptions));

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.get("/newsletter-signup", handlers.newsletterSignup);

app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);

app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

app.get("/vacations", handlers.listVacations);

app.get("/account", (req, res) => {
  if (!req.user) return res.redirect(303, "/unauthorized");
  res.render("account", { username: req.user.user?.name });
});

// we also need an 'unauthorized' page
app.get("/unauthorized", (req, res) => {
  res.status(403).render("unauthorized");
});

// and a way to logout
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

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
