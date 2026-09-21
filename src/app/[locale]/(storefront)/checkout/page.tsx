"use client";

import {createClient} from "@/lib/supabase/client";
import {ArrowLeft, ArrowRight, Check} from "lucide-react";
import {useLocale} from "next-intl";
import {useEffect, useMemo, useState} from "react";

import type {DeliveryMethod} from "@/types/order";
import {Container} from "@/components/ui/container";
import {useCart} from "@/components/cart/cart-provider";
import {placeOrder} from "@/lib/orders/order-service";
import {Link, useRouter} from "@/i18n/navigation";

type CheckoutForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {items, subtotal, isHydrated, clearCart} = useCart();

  const isArabic = locale === "ar";

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const supabase = createClient();

      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user) {
        router.replace("/account/login?redirect=/checkout");
        return;
      }

      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isArabic ? "ar" : "en", {
        style: "currency",
        currency: "SDG",
        maximumFractionDigits: 0,
      }),
    [isArabic],
  );

  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deliveryCost = deliveryMethod === "standard" ? 5000 : 10000;
  const total = subtotal + deliveryCost;

  const formatPrice = (value: number) => currencyFormatter.format(value);

  const updateField = (
    field: keyof CheckoutForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError(null);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = isArabic
        ? "الاسم الأول مطلوب"
        : "First name is required";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = isArabic
        ? "اسم العائلة مطلوب"
        : "Last name is required";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = isArabic
        ? "رقم الهاتف مطلوب"
        : "Phone number is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = isArabic
        ? "البريد الإلكتروني مطلوب"
        : "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = isArabic
        ? "أدخل بريدًا إلكترونيًا صحيحًا"
        : "Enter a valid email address";
    }

    if (!form.address.trim()) {
      nextErrors.address = isArabic
        ? "العنوان مطلوب"
        : "Address is required";
    }

    if (!form.city.trim()) {
      nextErrors.city = isArabic
        ? "المدينة مطلوبة"
        : "City is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError(null);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (items.length === 0) {
      setSubmitError(
        isArabic
          ? "حقيبتك فارغة."
          : "Your bag is empty.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await placeOrder({
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        },
        deliveryAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          notes: form.notes.trim(),
        },
        items,
        deliveryMethod,
        deliveryCost,
      });

      clearCart();

      const confirmationParams = new URLSearchParams({
        order: order.orderNumber,
      });

      // if (order.guestAccessToken) {
      //   confirmationParams.set(
      //     "token",
      //     order.guestAccessToken,
      //   );
      // }

      router.push(
        `/order-confirmation?${confirmationParams.toString()}`,
      );
    } catch (error) {
      console.error("Failed to place order:", error);

      setSubmitError(
        isArabic
          ? "تعذر إتمام طلبك. يرجى المحاولة مرة أخرى."
          : "We couldn't place your order. Please try again.",
      );

      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth || !isHydrated || !isAuthenticated) {
    return (
      <main
        className="min-h-screen bg-snow text-ink"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-px w-10 bg-plum" />
                <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.35em] text-ink/40">
                  {isArabic
                    ? "جارٍ تحميل الدفع"
                    : "Loading checkout"}
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main
        className="min-h-screen bg-snow text-ink"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <section className="px-6 pb-32 pt-36 sm:px-8 lg:px-12 lg:pb-40 lg:pt-44 xl:px-16">
          <Container className="max-w-360 px-0">
            <div className="grid min-h-[55vh] items-center lg:grid-cols-[1fr_0.8fr] lg:gap-24">
              <div>
                <p className="eyebrow text-plum">
                  {isArabic
                    ? "حقيبتك فارغة"
                    : "Your Bag Is Empty"}
                </p>

                <h1 className="mt-6 max-w-3xl font-editorial text-xl leading-[0.84] tracking-[-0.045em] sm:text-3xl lg:text-5xl">
                  {isArabic
                    ? "لا يمكن متابعة الدفع"
                    : "Nothing to Check Out"}
                </h1>

                <p className="mt-7 max-w-lg text-sm leading-7 text-ink/50">
                  {isArabic
                    ? "أضف بعض العطور إلى حقيبتك أولًا."
                    : "Add something beautiful to your bag before continuing."}
                </p>

                <Link
                  href="/shop"
                  className="mt-9 inline-flex h-14 items-center justify-center gap-4 bg-ink px-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-snow transition-colors duration-300 hover:bg-plum"
                >
                  <span>
                    {isArabic
                      ? "اكتشف العطور"
                      : "Discover Fragrance"}
                  </span>

                  {isArabic ? (
                    <ArrowLeft
                      size={16}
                      strokeWidth={1.25}
                    />
                  ) : (
                    <ArrowRight
                      size={16}
                      strokeWidth={1.25}
                    />
                  )}
                </Link>
              </div>

              <div className="mt-16 hidden lg:block">
                <div className="relative aspect-4/5 bg-plum">
                  <div className="absolute inset-8 border border-snow/15" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-editorial text-6xl italic text-snow/90">
                      {isArabic
                        ? "العطر"
                        : "Fragrance"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-snow text-ink"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="px-6 pb-16 pt-36 sm:px-8 md:pb-20 lg:px-12 lg:pb-24 lg:pt-44 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow text-plum">
                {isArabic
                  ? "الخطوة الأخيرة"
                  : "The Final Step"}
              </p>

              <h1 className={`mt-5 max-w-5xl font-editorial  leading-[0.84] tracking-[-0.045em] ${isArabic ? "text-2xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-3xl lg:text-5xl"}`}>
                {isArabic
                  ? "إتمام الشراء"
                  : "Complete Your Order"}
              </h1>

              <p className={`mt-7 max-w-xl ${isArabic ? "text-base" : "text-sm"} leading-7 text-ink/50`}>
                {isArabic
                  ? "أدخل بياناتك وسنعتني بالباقي."
                  : "Enter your details and we'll take care of the rest."}
              </p>
            </div>

            <div className="lg:pb-2">
              <div className={`flex items-center gap-3 ${isArabic ? "text-base" : "text-sm"} font-semibold uppercase tracking-[0.25em] text-ink/35`}>
                <span className="flex h-7 w-7 items-center justify-center bg-plum text-snow">
                  1
                </span>

                <span>
                  {isArabic
                    ? "بيانات الطلب"
                    : "Order Details"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-14 h-px w-full bg-ink/10" />
        </Container>
      </section>

      <section className="px-6 pb-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
        <Container className="max-w-360 px-0">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-24">
            <div>
              <section>
                <div className="flex items-end justify-between gap-6 border-b border-ink/10 pb-5">
                  <div>
                    <p className="eyebrow text-plum">
                      01
                    </p>

                    <h2 className={`mt-3 font-editorial ${isArabic ? "text-xl sm:text-3xl" : "text-xl sm:text-2xl"} leading-none tracking-[-0.03em]`}>
                      {isArabic
                        ? "معلوماتك"
                        : "Your Information"}
                    </h2>
                  </div>

                  <p className={`hidden pb-1 ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/30 sm:block`}>
                    {isArabic
                      ? "مطلوب"
                      : "Required"}
                  </p>
                </div>

                <div className="mt-8 grid gap-x-6 gap-y-7 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "الاسم الأول"
                        : "First Name"}
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      disabled={isSubmitting}
                      value={form.firstName}
                      onChange={(event) =>
                        updateField(
                          "firstName",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "الاسم الأول"
                          : "First name"
                      }
                      aria-invalid={Boolean(errors.firstName)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.firstName
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.firstName && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "اسم العائلة"
                        : "Last Name"}
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      disabled={isSubmitting}
                      value={form.lastName}
                      onChange={(event) =>
                        updateField(
                          "lastName",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "اسم العائلة"
                          : "Last name"
                      }
                      aria-invalid={Boolean(errors.lastName)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.lastName
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.lastName && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "رقم الهاتف"
                        : "Phone Number"}
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={isSubmitting}
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "رقم الهاتف"
                          : "Phone number"
                      }
                      aria-invalid={Boolean(errors.phone)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phone
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.phone && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "البريد الإلكتروني"
                        : "Email Address"}
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      disabled={isSubmitting}
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "البريد الإلكتروني"
                          : "Email address"
                      }
                      aria-invalid={Boolean(errors.email)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.email && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="mt-20">
                <div className="border-b border-ink/10 pb-5">
                  <p className="eyebrow text-plum">
                    02
                  </p>

                  <h2 className={`mt-3 font-editorial ${isArabic ? "text-xl sm:text-3xl" : "text-xl sm:text-2xl"} leading-none tracking-[-0.03em]`}>
                    {isArabic
                      ? "عنوان التوصيل"
                      : "Delivery Address"}
                  </h2>
                </div>

                <div className="mt-8 grid gap-7">
                  <div>
                    <label
                      htmlFor="address"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "العنوان"
                        : "Address"}
                    </label>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      disabled={isSubmitting}
                      value={form.address}
                      onChange={(event) =>
                        updateField(
                          "address",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "عنوان التوصيل"
                          : "Delivery address"
                      }
                      aria-invalid={Boolean(errors.address)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.address
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.address && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "المدينة"
                        : "City"}
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      disabled={isSubmitting}
                      value={form.city}
                      onChange={(event) =>
                        updateField(
                          "city",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "المدينة"
                          : "City"
                      }
                      aria-invalid={Boolean(errors.city)}
                      className={`h-14 w-full border bg-transparent rounded-2xl px-4 ${isArabic ? "text-base" : "text-sm"} text-ink outline-none transition-colors placeholder:text-ink/25 disabled:cursor-not-allowed disabled:opacity-50 ${errors.city
                        ? "border-coral"
                        : "border-ink/15 focus:border-plum"
                        }`}
                    />

                    {errors.city && (
                      <p className={`mt-2 ${isArabic ? "text-sm" : "text-xs"} leading-5 text-coral`}>
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className={`mb-2 block ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/45`}
                    >
                      {isArabic
                        ? "ملاحظات الطلب"
                        : "Order Notes"}
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      disabled={isSubmitting}
                      value={form.notes}
                      onChange={(event) =>
                        updateField(
                          "notes",
                          event.target.value,
                        )
                      }
                      placeholder={
                        isArabic
                          ? "أي ملاحظات إضافية؟"
                          : "Any additional notes?"
                      }
                      className="w-full resize-none border rounded-2xl border-ink/15 bg-transparent px-4 py-4 text-sm text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-plum disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </section>

              <section className="mt-20">
                <div className="border-b border-ink/10 pb-5">
                  <p className="eyebrow text-plum">
                    03
                  </p>

                  <h2 className={`mt-3 font-editorial ${isArabic ? "text-xl sm:text-3xl" : "text-xl sm:text-2xl"} leading-none tracking-[-0.03em]`}>
                    {isArabic
                      ? "طريقة التوصيل"
                      : "Delivery Method"}
                  </h2>
                </div>

                <div className="mt-8 grid gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setDeliveryMethod("standard")
                    }
                    aria-pressed={
                      deliveryMethod === "standard"
                    }
                    className={`group flex rounded-2xl w-full items-center justify-between border p-5 text-start transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:p-6 ${deliveryMethod === "standard"
                      ? "border-ink bg-ink text-snow"
                      : "border-ink/15 bg-transparent text-ink hover:border-plum"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${deliveryMethod === "standard"
                          ? "border-coral"
                          : "border-ink/20"
                          }`}
                      >
                        {deliveryMethod ===
                          "standard" && (
                            <span className="h-2 w-2 bg-coral" />
                          )}
                      </span>

                      <div>
                        <p className={`${isArabic ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.2em]`}>
                          {isArabic
                            ? "التوصيل العادي"
                            : "Standard Delivery"}
                        </p>

                        <p
                          className={`mt-2 ${isArabic ? "text-sm" : "text-sm"} ${deliveryMethod ===
                            "standard"
                            ? "text-snow/50"
                            : "text-ink/45"
                            }`}
                        >
                          {isArabic
                            ? "خلال 3–5 أيام عمل"
                            : "3–5 business days"}
                        </p>
                      </div>
                    </div>

                    <span className="font-editorial text-xl">
                      {formatPrice(5000)}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setDeliveryMethod("express")
                    }
                    aria-pressed={
                      deliveryMethod === "express"
                    }
                    className={`group flex rounded-2xl w-full items-center justify-between border p-5 text-start transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 sm:p-6 ${deliveryMethod === "express"
                      ? "border-ink bg-ink text-snow"
                      : "border-ink/15 bg-transparent text-ink hover:border-plum"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center border ${deliveryMethod === "express"
                          ? "border-coral"
                          : "border-ink/20"
                          }`}
                      >
                        {deliveryMethod ===
                          "express" && (
                            <span className="h-2 w-2 bg-coral" />
                          )}
                      </span>

                      <div>
                        <p className={`${isArabic ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.2em]`}>
                          {isArabic
                            ? "التوصيل السريع"
                            : "Express Delivery"}
                        </p>

                        <p
                          className={`mt-2 ${isArabic ? "text-sm" : "text-sm"} ${deliveryMethod ===
                            "express"
                            ? "text-snow/50"
                            : "text-ink/45"
                            }`}
                        >
                          {isArabic
                            ? "خلال 1–2 يوم عمل"
                            : "1–2 business days"}
                        </p>
                      </div>
                    </div>

                    <span className="font-editorial text-xl">
                      {formatPrice(10000)}
                    </span>
                  </button>
                </div>
              </section>

              <section className="mt-20">
                <div className="border-b border-ink/10 pb-5">
                  <p className="eyebrow text-plum">
                    04
                  </p>

                  <h2 className={`mt-3 font-editorial ${isArabic ? "text-xl sm:text-3xl" : "text-xl sm:text-2xl"} leading-none tracking-[-0.03em]`}>
                    {isArabic
                      ? "طريقة الدفع"
                      : "Payment Method"}
                  </h2>
                </div>

                <div className="mt-8 border rounded-2xl border-ink bg-ink p-6 text-snow sm:p-7">
                  <div className="flex items-start gap-5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-coral">
                      <Check
                        size={13}
                        strokeWidth={1.5}
                        className="text-coral"
                      />
                    </span>

                    <div>
                      <p className={`${isArabic ? "text-lg" : "text-sm"} font-semibold uppercase tracking-[0.2em]`}>
                        {isArabic
                          ? "الدفع عند الاستلام"
                          : "Cash on Delivery"}
                      </p>

                      <p className={`mt-3 max-w-md ${isArabic ? "text-base" : "text-sm"} leading-6 text-snow/50`}>
                        {isArabic
                          ? "ادفع عند استلام طلبك. لا حاجة للدفع مقدمًا."
                          : "Pay when your order is delivered. No payment is required in advance."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="border-t-2 border-ink bg-white px-7 py-8 sm:px-9 sm:py-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow text-plum">
                      {isArabic
                        ? "اختياراتك"
                        : "Your Selection"}
                    </p>

                    <h2 className={`mt-4 font-editorial ${isArabic ? "text-2xl" : "text-xl"} leading-none`}>
                      {isArabic
                        ? "ملخص الطلب"
                        : "Order Summary"}
                    </h2>
                  </div>

                  <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-ink/30">
                    {items.length}
                  </span>
                </div>

                <div className="my-8 h-px bg-ink/10" />

                <div className="space-y-6">
                  {items.map((item) => {
                    const translation =
                      item.product.translations.find(
                        (entry) =>
                          entry.locale === locale,
                      ) ??
                      item.product.translations.find(
                        (entry) =>
                          entry.locale === "en",
                      );

                    const name =
                      translation?.name ?? "";

                    return (
                      <div
                        key={`${item.product.id}-${item.size.ml}`}
                        className="flex items-start justify-between gap-5"
                      >
                        <div className="min-w-0">
                          <p className={`font-editorial ${isArabic ? "text-xl" : "text-lg"} leading-none text-ink`}>
                            {name}
                          </p>

                          <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35`}>
                            {item.size.ml}ml ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className={`shrink-0 ${isArabic ? "text-lg" : "text-base"} text-ink/65`}>
                          {formatPrice(
                            item.size.price *
                            item.quantity,
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="my-8 h-px bg-ink/10" />

                <div className="flex items-baseline justify-between gap-6">
                  <span className={`${isArabic ? "text-base" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
                    {isArabic
                      ? "المجموع الفرعي"
                      : "Subtotal"}
                  </span>

                  <div className="text-end">
                    <span className="font-editorial text-2xl leading-none">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6 border-t border-ink/10 pt-5">
                  <span className={`${isArabic ? "text-base" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/40`}>
                    {isArabic
                      ? "التوصيل"
                      : "Delivery"}
                  </span>

                  <div className="text-end">
                    <p className={`${isArabic ? "text-base" : "text-xs"} font-semibold uppercase tracking-[0.18em] text-ink/55`}>
                      {deliveryMethod ===
                        "standard"
                        ? isArabic
                          ? "عادي"
                          : "Standard"
                        : isArabic
                          ? "سريع"
                          : "Express"}
                    </p>

                    <p className={`${isArabic ? "text-lg" : "text-base"} mt-1 text-ink/65`}>
                      {formatPrice(deliveryCost)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline justify-between gap-6 border-t border-ink pt-6">
                  <span className={`${isArabic ? "text-base" : "text-xs"} font-semibold uppercase tracking-[0.25em] text-ink/50`}>
                    {isArabic
                      ? "الإجمالي"
                      : "Total"}
                  </span>

                  <div className="text-end">
                    <span className="font-editorial text-3xl leading-none">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="mt-7 border border-coral/30 bg-snow px-4 py-4"
                  >
                    <p className="text-[9px] leading-5 text-coral">
                      {submitError}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`mt-8 flex h-14 w-full items-center justify-center gap-4 bg-ink px-7 ${isArabic ? "text-base" : "text-sm"}  rounded-2xl font-semibold uppercase tracking-[0.28em] text-snow transition-colors duration-300 hover:bg-plum disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <span>
                    {isSubmitting
                      ? isArabic
                        ? "جارٍ تأكيد الطلب..."
                        : "Placing Order..."
                      : isArabic
                        ? "تأكيد الطلب"
                        : "Place Order"}
                  </span>

                  {!isSubmitting &&
                    (isArabic ? (
                      <ArrowLeft
                        size={16}
                        strokeWidth={1.25}
                      />
                    ) : (
                      <ArrowRight
                        size={16}
                        strokeWidth={1.25}
                      />
                    ))}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 bg-coral" />

                  <p className={`${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.2em] text-ink/30`}>
                    {isArabic
                      ? "الدفع عند الاستلام"
                      : "Cash on Delivery"}
                  </p>
                </div>
              </div>

              <Link
                href="/cart"
                className={`group mt-6 flex items-center justify-center gap-3 ${isArabic ? "text-sm" : "text-xs"} font-semibold uppercase tracking-[0.28em] text-ink/35 transition-colors hover:text-plum`}
              >
                {isArabic ? (
                  <>
                    <ArrowRight
                      size={14}
                      strokeWidth={1.25}
                      className="transition-transform group-hover:translate-x-1"
                    />

                    <span>العودة إلى الحقيبة</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft
                      size={14}
                      strokeWidth={1.25}
                      className="transition-transform group-hover:-translate-x-1"
                    />

                    <span>Back to Bag</span>
                  </>
                )}
              </Link>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}