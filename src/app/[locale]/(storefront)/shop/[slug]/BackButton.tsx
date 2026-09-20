'use client';
import {useRouter} from '@/i18n/navigation';
import {useLocale} from 'next-intl';
import React from 'react';

export default function BackButton() {
  const router = useRouter();
  const locale = useLocale();

  const isArabic = locale === 'ar';

  return (
    <div className="transition-colors hover:text-plum cursor-pointer" onClick={() => router.back()}>
      {isArabic ? "المتجر" : "Shop"}
    </div>
  );
}
