export type LangCode = 'fa' | 'en';

export type ErrorHandlerSection = 'httpCode';

export type ErrorHandlerTextKeys = {
    default: string;
    [key: string]: string;
};

type ErrorHandlerTextsByLang = Record<ErrorHandlerSection, ErrorHandlerTextKeys>;

export const ERROR_HANDLER_TEXTS: Record<LangCode, ErrorHandlerTextsByLang> = {
    fa: {
        httpCode: {
            '400': 'درخواست شما معتبر نیست. لطفاً دوباره تلاش کنید.',
            '401': 'شما وارد حساب کاربری خود نشده‌اید یا توکن منقضی شده است. لطفاً وارد شوید.',
            '403': 'دسترسی شما محدود است. شما اجازه دسترسی به این صفحه را ندارید.',
            '404': 'صفحه یا منبع مورد نظر یافت نشد.',
            '500': 'خطای سرور. لطفاً دوباره تلاش کنید.',
            '503': 'سرور در دسترس نیست. لطفاً بعداً تلاش کنید.',
            default: 'خطای ناشناخته، لطفاً بعداً تلاش کنید.'

        },
    },
    en: {
        httpCode: {
            '400': 'Your request is invalid. Please try again.',
            '401': 'You are not logged in or your token has expired. Please log in.',
            '403': 'Your access is restricted. You do not have permission to access this page.',
            '404': 'The page or resource you are looking for could not be found.',
            '500': 'Server error. Please try again.',
            '503': 'The server is unavailable. Please try again later.',
            default: 'Unknown error, please try again later.'
        },
    },
};
