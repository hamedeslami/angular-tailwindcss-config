export type LangCode = 'fa' | 'en';

export type LayoutSection =
    'user'
    | 'notification'
    | 'search'

export type LayoutTextKeys = {
    title: string;
    subtitle?: string;
    button?: string;
    [key: string]: string | undefined;
};

type LayoutTextsByLang = Record<LayoutSection, LayoutTextKeys>;

export const LAYOUT_TEXTS: Record<LangCode, LayoutTextsByLang> = {
    fa: {
        user: {
            title: 'حساب کاربری',
            signout: 'خروج از حساب کاربری',
            editProfile:'ویرایش حساب کاربری',
            setting: 'تنظیمات',
            support: 'پشتیبانی'
        },
        notification: {
            title: 'اعلان',
            showAll: 'مشاهده همه اعلان ها'
        },
        search: {
            title: 'جستجو',
            placeholder: 'جستجو یا تایپ دستور ...'
        }
    },
    en: {
        user: {
            title: 'Account',
            signout: 'Sign out of the account',
            editProfile:'Edit profile',
            setting: 'Setting',
            support: 'Support'
        },
        notification: {
            title: 'Notification',
            showAll: 'View all notifications'
        },
        search: {
            title: 'Search',
            placeholder: 'Search or type command...'
        }
    },
};
