"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLanguage = exports.i18nextMiddleware = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_express_middleware_1 = __importDefault(require("i18next-express-middleware"));
const path_1 = __importDefault(require("path"));
i18next_1.default.use(i18next_fs_backend_1.default)
    .init({
    fallbackLng: 'en',
    preload: ['en', 'ar', 'tr'],
    ns: ['translation'],
    defaultNS: 'translation',
    saveMissing: true,
    backend: {
        loadPath: path_1.default.join(__dirname, './locales/{{lng}}/{{ns}}.json')
    },
    detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie']
    },
    debug: false,
    interpolation: {
        escapeValue: false
    }
});
exports.i18nextMiddleware = i18next_express_middleware_1.default.handle(i18next_1.default);
const setLanguage = (req, res, next) => {
    const lang = req.query.locale || 'en';
    req.language = lang;
    req.i18n.changeLanguage(lang);
    next();
};
exports.setLanguage = setLanguage;
exports.default = i18next_1.default;
//# sourceMappingURL=i18n.js.map