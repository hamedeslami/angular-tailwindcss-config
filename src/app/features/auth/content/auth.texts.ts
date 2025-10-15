export type LangCode = 'fa' | 'en';

export type AuthSection =
    | 'main'
    | 'login'
    | 'forgotPassword'
    | 'verificationCode';

export type AuthTextKeys = {
    title: string;
    subtitle?: string;
    button?: string;
    [key: string]: string | undefined;
};

type AuthTextsByLang = Record<AuthSection, AuthTextKeys>;

export const AUTH_TEXTS: Record<LangCode, AuthTextsByLang> = {
    fa: {
        main:{
            title: 'توصیه‌های امنیتی',
            signOut: 'در پایان هر بار استفاده از سامانه حتما از حساب کاربری خود خارج شوید.',
            notShareInfo: 'نام کاربری و رمز عبور شما محرمانه است، از ارسال این اطلاعات به شخص دیگری خودداری کنید.',
            changePassword: 'رمز عبور خود را به صورت منظم و در بازه‌های زمانی کوتاه ترجیحا در بازه‌های کمتر از سه ماه تغییر دهید.'

        },
        login: {
            title: 'ورود به حساب کاربری',
            subtitle: 'لطفاً اطلاعات ورود خود را وارد کنید',
            username: 'نام کاربری',
            password: 'رمز عبور',
            button: 'ورود',
            forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
            invalidUsername: 'نام کاربری معتبر نمی باشد.',
            invalidPassword: 'رمز عبور معتبر نمی باشد.'
        },
        forgotPassword: {
            title: 'بازیابی رمز عبور',
            subtitle: 'ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود',
            button: 'ارسال لینک بازیابی',
        },
        verificationCode: {
            title: 'کد تأیید',
            subtitle: 'کد ارسال‌شده را وارد کنید',
            button: 'تأیید کد',
        },
    },
    en: {
        main:{
            title: 'Security recommendations',
            signOut: 'Be sure to log out of your account at the end of each use of the system.',
            notShareInfo: 'Your username and password are confidential, do not share this information with anyone else.',
            changePassword: 'Change your password regularly and at short intervals, preferably less than three months.'
        },
        login: {
            title: 'Login to your account',
            subtitle: 'Please enter your login information',
            username: 'Username',
            password: 'Password',
            button: 'Login',
            forgotPassword: 'Forgot your password?',
            invalidUsername: 'The username entered is not valid.',
            invalidPassword: 'The password entered is not valid.'

        },
        forgotPassword: {
            title: 'Reset Password',
            subtitle: 'Enter your email to receive the reset link',
            button: 'Send Reset Link',
        },
        verificationCode: {
            title: 'Verification Code',
            subtitle: 'Enter the code you received',
            button: 'Verify Code',
        },
    },
};
