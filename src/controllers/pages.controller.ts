// src/controllers/pages.controller.ts

import { Request, Response } from 'express';
import Pages, { PageType } from '../database/models/pages.model';
import { LocaleKeys, queries } from 'index';

const pageField = (page: PageType, locale?: LocaleKeys) => {
    return {
        id: page._id,
        slug: page.slug,
        title: page.title[locale] || page.title,
        content: page.content[locale] || page.content,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        status: page.status,
    };
};

export const getPages = async (req: Request, res: Response): Promise<void> => {
    try {
        const pages = await Pages.find();

        const { locale, multiLocale } = req.query as unknown as queries;

        res.status(200).json({
            message: pages.length === 0 ? 'No pages found' : 'Successfully fetched all pages',
            pages: pages.map(page => multiLocale ? pageField(page) : pageField(page, locale)),
            count: pages.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pages', error });
    }
};

export const getPageById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const page = await Pages.findById(id);
        if (page) {
            res.status(200).json({
                message: 'Page found successfully',
                page: pageField(page)
            });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

// Get by slug 
export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const page = await Pages.findOne({ slug });
        const { locale, multiLocale } = req.query as queries
        if (page) {
            res.status(200).json({
                message: 'Page found successfully',
                page: multiLocale ? pageField(page) : pageField(page, locale),
            });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page', error });
    }
};

export const createPage = async (req: Request, res: Response): Promise<void> => {
    try {
        const newPage = new Pages(req.body);
        const savedPage = await newPage.save();
        res.status(201).json(savedPage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating page', error });
    }
};

export const updatePage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedPage = await Pages.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedPage) {
            res.status(200).json(updatedPage);
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating page', error });
    }
};

export const deletePage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedPage = await Pages.findByIdAndDelete(id);
        if (deletedPage) {
            res.status(200).json({ message: 'Page deleted successfully' });
        } else {
            res.status(404).json({ message: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting page', error });
    }
};