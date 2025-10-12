export type LangCode = 'fa' | 'en';

export type AuthSection =
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
        login: {
            title: 'ورود به حساب کاربری',
            subtitle: 'لطفاً اطلاعات ورود خود را وارد کنید',
            button: 'ورود',
            forgotPassword: 'رمز عبور را فراموش کرده‌اید؟',
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
        login: {
            title: 'Login to your account',
            subtitle: 'Please enter your login information',
            button: 'Login',
            forgotPassword: 'Forgot your password?',
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
