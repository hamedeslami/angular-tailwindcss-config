export type LangCode = 'fa' | 'en';

export type NotFoundSection ='main'

export type NotFoundTextKeys = {
    title: string;
    description?: string;
    button?: string;
};

type NotFoundTextsByLang = Record<NotFoundSection, NotFoundTextKeys>;

export const NOT_FOUND_TEXTS: Record<LangCode, NotFoundTextsByLang> = {
    fa: {
        main: {
            title: 'صفحه یافت نشد',
            description: 'صفحه‌ای که دنبال آن بودید پیدا نشد!',
            button: 'بازگشت به صفحه اصلی',

        }
    },
    en: {
        main: {
            title: 'Page not found',
            description: 'The page you were looking for was not found!',
            button: 'Return to the main page',
        },
    },
};
