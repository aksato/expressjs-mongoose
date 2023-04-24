import { NextFunction, Request, Response } from "express";

export const home = (req: Request, res: Response) => res.render("home");
export const about = (req: Request, res: Response) => res.render("about");
export const notFound = (req: Request, res: Response) => res.render("404");
export const serverError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => res.render("500");

export const newsletterSignup = (req: Request, res: Response) => {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render("newsletter-signup", { csrf: "CSRF token goes here" });
};

export const newsletterSignupProcess = (req: Request, res: Response) => {
  console.log("Form (from querystring): " + req.query.form);
  console.log("CSRF token (from hidden form field): " + req.body._csrf);
  console.log("Name (from visible form field): " + req.body.name);
  console.log("Email (from visible form field): " + req.body.email);
  res.redirect(303, "/newsletter-signup/thank-you");
};

export const newsletterSignupThankYou = (req: Request, res: Response) =>
  res.render("newsletter-signup-thank-you");
