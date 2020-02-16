import {Middleware} from '@nuxt/types';

const i18nMiddleware: Middleware = async ({isDev, isHMR, app, route, params, error, redirect}): Promise<void> => {
    const accessor = app.$accessor;
    const i18n = app.$i18n;

    const defaultLocale = i18n.options.lng;

    // If middleware is called from hot module replacement, ignore it
    if (isHMR) {
        return;
    }

    // Get locale from params
    const locale = params.lang || defaultLocale;
    if (!(locale && accessor.locales.includes(locale))) {
        return error({message: 'This page could not be found.', statusCode: 404});
    }

    // Set locale
    if (isDev || !i18n.getDataByLanguage(locale)) {
        const resource = await import(/* webpackChunkName: "locale-[request]" */ `~/static/locales/${locale}.json`);
        console.log(i18n);
        Object.keys(resource.default).forEach(ns =>
            i18n.addResourceBundle(locale, ns, resource.default[ns], true, true)
        );
    }
    await accessor.changeLanguage(locale);

    // If route is /<defaultLocale>/... -> redirect to /...
    if (locale === defaultLocale && route.fullPath.startsWith('/')) {
        const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '');
        const re = new RegExp(toReplace);
        return redirect(route.fullPath.replace(re, '/'));
    }
};

export default i18nMiddleware;
