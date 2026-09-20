import { createServerClient } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';

export async function updateSupabaseSession(
  request: NextRequest,
  response: NextResponse,
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet, headers) {
          // Make refreshed cookies available to downstream
          // Server Components during this same request.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Preserve the next-intl response and attach the
          // refreshed Supabase cookies to it.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          // Supabase SSR may provide cache-safety headers
          // when a session is refreshed.
          if (headers) {
            Object.entries(headers).forEach(([name, value]) => {
              response.headers.set(name, value);
            });
          }
        },
      },
    },
  );

  // Verify the token and allow Supabase SSR to refresh it
  // when needed. Do not insert unrelated work before this.
  const { data, error } = await supabase.auth.getClaims();

  return {
    supabase,
    user: error ? null : (data?.claims ?? null),
    response,
  };
}
