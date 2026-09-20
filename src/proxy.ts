import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { updateSupabaseSession } from './lib/supabase/proxy';

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const intlResponse = handleI18nRouting(request);
  const response = intlResponse;

  const pathname = request.nextUrl.pathname;

  const adminRoute = getAdminRoute(pathname);
  const customerRoute = getCustomerRoute(pathname);

  /*
   * Refresh the Supabase session for authenticated
   * storefront/customer routes and admin routes.
   */
  if (adminRoute || customerRoute) {
    const { user } = await updateSupabaseSession(request, response);

    /*
     * Admin authentication
     *
     * Role authorization will be handled separately
     * in AUTH-4. For now, this only checks whether
     * a valid authenticated session exists.
     */
    if (adminRoute) {
      if (!user) {
        const loginPath =
          adminRoute.locale === routing.defaultLocale
            ? '/account/login'
            : `/${adminRoute.locale}/account/login`;

        return NextResponse.redirect(new URL(loginPath, request.url));
      }

      return response;
    }

    /*
     * Customer authentication
     *
     * Login and registration remain public.
     * Only the actual account page requires authentication.
     */
    if (customerRoute) {
      if (customerRoute.isAccountPage && !user) {
        const loginPath =
          customerRoute.locale === routing.defaultLocale
            ? '/account/login'
            : `/${customerRoute.locale}/account/login`;

        return NextResponse.redirect(new URL(loginPath, request.url));
      }
    }
  }

  return response;
}

function getAdminRoute(pathname: string) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return {
      locale: routing.defaultLocale,
    };
  }

  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) {
      continue;
    }

    const adminPath = `/${locale}/admin`;

    if (pathname === adminPath || pathname.startsWith(`${adminPath}/`)) {
      return {
        locale,
      };
    }
  }

  return null;
}

function getCustomerRoute(pathname: string) {
  const defaultAccountPath = '/account';

  if (
    pathname === defaultAccountPath ||
    pathname.startsWith(`${defaultAccountPath}/`)
  ) {
    return {
      locale: routing.defaultLocale,
      isAccountPage: pathname === defaultAccountPath,
    };
  }

  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) {
      continue;
    }

    const accountPath = `/${locale}/account`;

    if (pathname === accountPath || pathname.startsWith(`${accountPath}/`)) {
      return {
        locale,
        isAccountPage: pathname === accountPath,
      };
    }
  }

  return null;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
