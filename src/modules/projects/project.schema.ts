import { Schema, Document } from 'mongoose';
import { LocaleKeys } from 'src/types';

export interface IProject extends Document {
  updatedAt: Date;
  createdAt: Date;
  title: { [key in LocaleKeys]: string };
  description: { [key in LocaleKeys]?: string };
  background: string;
  images: string[];
  status: string;
  featured: boolean;
  category: string | object;
  user: string | object;
  domain?: string;
}

export const ProjectSchema = new Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String },
    tr: { type: String },
  },
  description: {
    en: { type: String },
    ar: { type: String },
    tr: { type: String },
  },
  status: { type: String, required: true },
  featured: { type: Boolean, default: false },
  background: { type: String },
  images: { type: [String] },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
