import { Schema, model, Document } from "mongoose";

interface IVacation extends Document {
  name: string;
  slug: string;
  category: string;
  sku: string;
  description: string;
  locale: {
    search: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  tags: string[];
  inSeason: boolean;
  available: boolean;
  requiresWaiver: boolean;
  maximumGuests: number;
  notes: string;
  packagesSold: number;
}

const VacationSchema = new Schema({
  name: String,
  slug: String,
  category: String,
  sku: String,
  description: String,
  locale: {
    search: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  price: Number,
  tags: [String],
  inSeason: Boolean,
  available: Boolean,
  requiresWaiver: Boolean,
  maximumGuests: Number,
  notes: String,
  packagesSold: Number,
});

const Vacation = model<IVacation>("Vacation", VacationSchema);

export { Vacation, IVacation };
