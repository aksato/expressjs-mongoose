import MongoStore from "connect-mongo";

if (!process.env.SESSION_SECRET) {
  throw new Error("Please add the SESSION_SECRET environment variable");
}

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  ttl: 20000,
});

export const sessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  cookie: { maxAge: 20000, httpOnly: true, signed: true },
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
};
