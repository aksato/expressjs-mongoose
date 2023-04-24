import mongoose from "mongoose";
import { IVacation, Vacation } from "../models/vacation";

if (!process.env.MONGO_URL) {
  throw new Error("Please add the MONGO_URL environment variable");
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on(
  "error",
  console.error.bind(console, "❌ mongodb connection error")
);
database.once("open", () => console.log("✅ mongodb connected successfully"));

mongoose.Promise = Promise;

Vacation.find((err: any, vacations: IVacation[]) => {
  if (err) return console.error(err);
  if (vacations.length) return;
  new Vacation({
    name: "Hood River Day Trip",
    slug: "hood-river-day-trip",
    category: "Day Trip",
    sku: "HR199",
    description:
      "Spend a day sailing on the Columbia and " +
      "enjoying craft beers in Hood River!",
    locale: {
      search: "Hood River, Oregon, USA",
    },
    price: 99.95,
    tags: ["day trip", "hood river", "sailing", "windsurfing", "breweries"],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save();
  new Vacation({
    name: "Oregon Coast Getaway",
    slug: "oregon-coast-getaway",
    category: "Weekend Getaway",
    sku: "OC39",
    description: "Enjoy the ocean air and quaint coastal towns!",
    locale: {
      search: "Cannon Beach, Oregon, USA",
    },
    price: 269.95,
    tags: ["weekend getaway", "oregon coast", "beachcombing"],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
  }).save();
  new Vacation({
    name: "Rock Climbing in Bend",
    slug: "rock-climbing-in-bend",
    category: "Adventure",
    sku: "B99",
    description: "Experience the thrill of climbing in the high desert.",
    locale: {
      search: "Bend, Oregon, USA",
    },
    price: 289.95,
    tags: ["weekend getaway", "bend", "high desert", "rock climbing"],
    inSeason: true,
    requiresWaiver: true,
    maximumGuests: 4,
    available: false,
    packagesSold: 0,
    notes: "The tour guide is currently recovering from a skiing accident.",
  }).save();
});

export const getVacations = async (options: { available?: boolean } = {}) =>
  Vacation.find(options);

export const addVacationInSeasonListener = async (
  email: string,
  sku: string
) => {
  // we'll just pretend we did this...since this is
  // an async function, a new promise will automatically
  // be returned that simply resolves to undefined
};
