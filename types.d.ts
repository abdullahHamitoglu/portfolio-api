declare namespace Express {
  export interface Request {
    i18n: any;
    t: any;
    language: any;
    user: {
      _id: string;
    };
  }
  export interface Response {
    i18n: any;
    t: any;
    language: any;
  }
}
