import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware, { LanguageDetector } from 'i18next-express-middleware';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

i18n.use(Backend)
    .init({
        fallbackLng: 'en', // Default language
        preload: ['en', 'ar', 'tr'], // Languages to preload
        ns: ['translation'], // Namespace used in translation files
        defaultNS: 'translation',
        saveMissing: true,
        backend: {
            loadPath: path.join(__dirname, './locales/{{lng}}/{{ns}}.json')
        },
        detection: {
            order: ['querystring', 'cookie'], // Detection order
            caches: ['cookie'] // Cache user language on
        },
        debug: false, // Enable debug mode
        interpolation: {
            escapeValue: false // Not needed for express
        }
    });

export const i18nextMiddleware = middleware.handle(i18n);

export const setLanguage = (req: Request, res: Response, next: NextFunction) => {
    const lang = req.query.locale || 'en';
    req.language = lang;
    req.i18n.changeLanguage(lang);
    next();
};

export default i18n;
