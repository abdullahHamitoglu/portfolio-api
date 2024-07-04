"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePage = exports.updatePage = exports.createPage = exports.getPageBySlug = exports.getPageById = exports.getPages = void 0;
const pages_model_1 = __importDefault(require("../database/models/pages.model"));
const pageField = (page, locale) => {
    return {
        id: page._id,
        slug: page.slug,
        title: page.title[locale] || page.title,
        content: page.content[locale] || page.content,
        featured: page.featured,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        status: page.status,
    };
};
const getPages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locale, multiLocale, featured } = req.query;
        const query = featured ? { featured } : {};
        const pages = yield pages_model_1.default.find(query);
        res.status(200).json({
            message: pages.length === 0 ? 'No pages found' : 'Successfully fetched all pages',
            pages: pages.map(page => multiLocale ? pageField(page) : pageField(page, locale)),
            count: pages.length,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pages', error });
    }
});
exports.getPages = getPages;
const getPageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const page = yield pages_model_1.default.findById(id);
        if (page) {
            res.status(200).json({
                message: 'Page found successfully',
                page: pageField(page)
            });
        }
        else {
            res.status(404).json({ message: 'Page not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
});
exports.getPageById = getPageById;
const getPageBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const page = yield pages_model_1.default.findOne({ slug });
        const { locale, multiLocale } = req.query;
        if (page) {
            res.status(200).json({
                message: 'Page found successfully',
                page: multiLocale ? pageField(page) : pageField(page, locale),
            });
        }
        else {
            res.status(404).json({ message: 'Page not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
});
exports.getPageBySlug = getPageBySlug;
const createPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPage = new pages_model_1.default(req.body);
        const savedPage = yield newPage.save();
        res.status(201).json(savedPage);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating page', error });
    }
});
exports.createPage = createPage;
const updatePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedPage = yield pages_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedPage) {
            res.status(200).json(updatedPage);
        }
        else {
            res.status(404).json({ message: 'Page not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating page', error });
    }
});
exports.updatePage = updatePage;
const deletePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPage = yield pages_model_1.default.findByIdAndDelete(id);
        if (deletedPage) {
            res.status(200).json({ message: 'Page deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Page not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting page', error });
    }
});
exports.deletePage = deletePage;
//# sourceMappingURL=pages.controller.js.map