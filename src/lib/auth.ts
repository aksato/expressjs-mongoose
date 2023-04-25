import passport from "passport";
import passportFacebook from "passport-facebook";
import * as db from "./db";
import { Express, RequestHandler } from "express";
const FacebookStrategy = passportFacebook.Strategy;
import { Request, Response } from "express";
import { IUser } from "../models/user";

interface IAuthProvider {
  appId: string;
  appSecret: string;
}

interface AuthOptions {
  baseUrl?: string;
  successRedirect: string;
  failureRedirect: string;
  providers: { [key: string]: IAuthProvider };
}

passport.serializeUser((user, done) => done(null, user.user?._id));

passport.deserializeUser<number>((id, done) => {
  db.getUserById(id)
    .then((user) => done(null, { user: user }))
    .catch((err) => done(err, null));
});

function handleRedirect(
  req: Request<{}, {}, {}, { redirect: string }>,
  res: Response,
  options: AuthOptions,
  code = 303
) {
  // the default way to specify where to rediretc to after successful redirect is
  // req.session.authRedirect; see "customerOnly" and "employeeOnly" middlware for
  // an example.  req.query.redirect is also provided for testing & future expansion.
  const redirectUrl =
    req.session.authRedirect || req.query.redirect || options.successRedirect;
  delete req.session.authRedirect; // harmless if it doesn't exist
  res.redirect(code, redirectUrl);
}

export const createAuth = (app: Express, options: AuthOptions) => {
  // if success and failure redirects aren't specified,
  // set some reasonable defaults
  if (!options.successRedirect) options.successRedirect = "/account";
  if (!options.failureRedirect) options.failureRedirect = "/login";
  return {
    init: function () {
      const config = options.providers;

      // configure Facebook strategy
      passport.use(
        new FacebookStrategy(
          {
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: (options.baseUrl || "") + "/auth/facebook/callback",
          },
          (accessToken, refreshToken, profile, done) => {
            const authId = "facebook:" + profile.id;
            db.getUserByAuthId(authId)
              .then((user) => {
                if (user) return done(null, user);
                db.addUser({
                  authId: authId,
                  name: profile.displayName,
                  created: new Date(),
                  role: "customer",
                })
                  .then((user) => done(null, user))
                  .catch((err) => done(err, null));
              })
              .catch((err) => {
                if (err) return done(err, null);
              });
          }
        )
      );
      app.use(passport.initialize());
      app.use(passport.session());
    },
    registerRoutes: () => {
      const authFacebook: RequestHandler<{}, {}, {}, { redirect: string }> = (
        req,
        res,
        next
      ) => {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect;
        passport.authenticate("facebook")(req, res, next);
      };
      // register Facebook routes
      app.get("/auth/facebook", authFacebook);
      app.get(
        "/auth/facebook/callback",
        () => {
          console.log(options);
          const res = passport.authenticate("facebook", {
            failureRedirect: options.failureRedirect,
          });
          console.log(res);
          return res;
        },
        (req: Request<{}, {}, {}, { redirect: string }>, res) => {
          console.log("successful /auth/facebook/callback");
          // we only get here on successful authentication
          handleRedirect(req, res, options);
        }
      );
    },
  };
};
