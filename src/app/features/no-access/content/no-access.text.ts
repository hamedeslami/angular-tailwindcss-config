export type LangCode = 'fa' | 'en';

export type NoAccessSection ='main'

export type NoAccessTextKeys = {
    title: string;
    description?: string;
    button?: string;
};

type NoAccessTextsByLang = Record<NoAccessSection, NoAccessTextKeys>;

export const NO_ACCESS_TEXTS: Record<LangCode, NoAccessTextsByLang> = {
    fa: {
        main: {
            title: 'عدم دسترسی',
            description: 'برای شما دسترسی به این صفحه مجاز نیست.',
            button: 'بازگشت به صفحه اصلی',

        }
    },
    en: {
        main: {
            title: 'Access Denied',
            description: 'You are not authorized to access this page.',
            button: 'Return to the main page',
        },
    },
};
