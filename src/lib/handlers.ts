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
