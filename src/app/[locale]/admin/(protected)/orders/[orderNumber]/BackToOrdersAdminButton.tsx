'use client';
import {useRouter} from '@/i18n/navigation';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';
import React from 'react';

export default function BackToOrdersAdminButton() {
  const router = useRouter();

  const t = useTranslations('AdminOrders');
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-950 cursor-pointer" onClick={() => router.back()}>
      <ArrowLeft className="size-4" />
      {t('backToOrders')}
    </div>
  );
}
