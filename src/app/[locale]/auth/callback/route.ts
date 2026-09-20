import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  const locale = requestUrl.pathname.split('/')[1];
  const isSupportedLocale = routing.locales.includes(
    locale as (typeof routing.locales)[number],
  );

  const currentLocale = isSupportedLocale ? locale : routing.defaultLocale;

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectPath =
        next && next.startsWith('/')
          ? next
          : currentLocale === routing.defaultLocale
            ? '/account'
            : `/${currentLocale}/account`;

      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
    }
  }

  const loginPath =
    currentLocale === routing.defaultLocale
      ? '/account/login?error=auth_callback_error'
      : `/${currentLocale}/account/login?error=auth_callback_error`;

  return NextResponse.redirect(new URL(loginPath, requestUrl.origin));
}
