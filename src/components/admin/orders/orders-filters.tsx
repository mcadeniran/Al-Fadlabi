'use client';

import {Search, X, } from 'lucide-react';
import {useEffect, useState, } from 'react';
import {usePathname, useRouter, } from '@/i18n/navigation';
import {useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

export function OrdersFilters() {
  const t = useTranslations(
    'AdminOrders',
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] =
    useState(
      searchParams.get('search') ?? '',
    );

  const status =
    searchParams.get('status') ?? 'all';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(
      searchParams.get('search') ?? '',
    );
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateFilter(
        'search',
        search.trim(),
      );
    }, 350);

    return () =>
      clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateFilter(
    key: string,
    value: string,
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    if (
      !value ||
      value === 'all'
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query =
      params.toString();

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
    );
  }

  function clearFilters() {
    setSearch('');
    router.replace(pathname);
  }

  const hasFilters =
    search ||
    status !== 'all';

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder={t(
              'searchPlaceholder',
            )}
            className="h-10 w-full rounded-xl border border-neutral-200 bg-white ps-10 pe-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            updateFilter(
              'status',
              event.target.value,
            )
          }
          className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
        >
          <option value="all">
            {t('allStatuses')}
          </option>

          <option value="pending">
            {t('statuses.pending')}
          </option>

          <option value="confirmed">
            {t('statuses.confirmed')}
          </option>

          <option value="processing">
            {t('statuses.processing')}
          </option>

          <option value="out_for_delivery">
            {t(
              'statuses.out_for_delivery',
            )}
          </option>

          <option value="delivered">
            {t('statuses.delivered')}
          </option>

          <option value="rejected">
            {t('statuses.rejected')}
          </option>

          <option value="cancelled">
            {t('statuses.cancelled')}
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <X className="size-4" />

            {t('clearFilters')}
          </button>
        )}
      </div>
    </div>
  );
}