'use client';

import {FormEvent, useState} from 'react';

import Link from 'next/link';

import {useTranslations} from 'next-intl';

import {createClient} from '@/lib/supabase/client';

import {useRouter} from '@/i18n/navigation';

import {getLoginDestination} from '@/app/[locale]/(storefront)/account/login/actions';

type LoginFormProps = {
  redirectTo?: string;
};

type LoginMethod = 'email' | 'username';

export function LoginForm({redirectTo}: LoginFormProps) {
  const t = useTranslations('Auth');

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim().toLowerCase();

    if (!password) {
      setError(t('login.errors.required'));
      return;
    }

    if (loginMethod === 'email' && !trimmedEmail) {
      setError(t('login.errors.required'));
      return;
    }

    if (loginMethod === 'username' && !trimmedUsername) {
      setError(t('login.errors.required'));
      return;
    }

    if (
      loginMethod === 'username' &&
      !/^[a-z0-9][a-z0-9._-]{2,29}$/.test(trimmedUsername)
    ) {
      setError(t('login.errors.usernameFormat'));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const authEmail =
        loginMethod === 'username'
          ? `u_${trimmedUsername}@auth.alfadlabiperfume.com`
          : trimmedEmail;

      const {error: signInError} =
        await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

      if (signInError) {
        setError(t('login.errors.invalidCredentials'));
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      const destination = await getLoginDestination();

      if (destination === 'admin') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    } catch (error) {
      console.error('Login error:', error);

      setError(t('login.errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  const isUsernameLogin = loginMethod === 'username';

  return (
    <section className="space-y-10">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t('login.eyebrow')}
        </p>

        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          {t('login.title')}
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-7 text-muted-foreground">
          {t('login.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.15em]">
            {t('login.loginMethod')}
          </p>

          <div className="grid grid-cols-2 border border-border">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setError('');
              }}
              disabled={loading}
              className={`h-11 px-4 text-xs uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${loginMethod === 'email'
                ? 'bg-foreground text-background'
                : 'bg-transparent text-foreground hover:bg-muted'
                }`}
            >
              {t('login.emailMethod')}
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('username');
                setError('');
              }}
              disabled={loading}
              className={`h-11 border-s border-border px-4 text-xs uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${loginMethod === 'username'
                ? 'bg-foreground text-background'
                : 'bg-transparent text-foreground hover:bg-muted'
                }`}
            >
              {t('login.usernameMethod')}
            </button>
          </div>
        </div>

        {isUsernameLogin ? (
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-xs uppercase tracking-[0.15em]"
            >
              {t('login.username')}
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value.toLowerCase())
              }
              maxLength={30}
              spellCheck={false}
              disabled={loading}
              className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              {t('login.usernameHint')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-[0.15em]"
            >
              {t('login.email')}
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-xs uppercase tracking-[0.15em]"
          >
            {t('login.password')}
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            className="h-12 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors focus:border-foreground disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {!isUsernameLogin && (
          <div className="flex justify-end">
            <Link
              href="/account/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center border border-foreground bg-foreground px-6 text-xs uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? t('login.signingIn') : t('login.submit')}
        </button>
      </form>

      <div className="border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t('login.noAccount')}{' '}
          <Link
            href="/account/register"
            className="text-foreground underline underline-offset-4"
          >
            {t('login.register')}
          </Link>
        </p>
      </div>
    </section>
  );
}