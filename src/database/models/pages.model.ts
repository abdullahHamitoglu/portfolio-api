import { LocaleKeys } from "index";
import mongoose, { Schema } from "mongoose";
export type PageType = {
    _id: string,
    id: string,
    slug: string,
    title: { [key in LocaleKeys]: string },
    content: { [key in LocaleKeys]: string },
    status: string;
    featured: boolean,
    createdAt: Date,
    updatedAt: Date,
}
const PageSchema: Schema = new Schema({
    slug: { type: String, required: true },
    title: {
        ar: { type: String, required: [true, "Please provide title in English"], },
        en: { type: String, },
        tr: { type: String, }
    },
    content: {
        ar: { type: String, required: [true, "Please provide content in English"], },
        en: { type: String, },
        tr: { type: String, }
    },
    status: { type: String, default: [true, "Please provide status in English"] },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Pages = mongoose.model<PageType>('Pages', PageSchema);

export default Pages