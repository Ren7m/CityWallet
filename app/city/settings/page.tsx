"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  useBudget,
} from "@/context/BudgetContext";

import {
  useLanguage,
} from "@/context/LanguageContext";

import styles from "./settings.module.css";

export default function SettingsPage() {
  const {
    user,
    updateUser,
  } = useAuth();

  const {
    monthlySalary,
    setMonthlySalary,
    budget,
    setBudget,
    expenses,
    clearExpenses,
  } = useBudget();

  const {
    language,
    isArabic,
    setLanguage,
  } = useLanguage();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    salary,
    setSalary,
  ] = useState("");

  const [
    monthlyBudget,
    setMonthlyBudget,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);

    setEmail(user.email);

    setSalary(
      String(
        monthlySalary || ""
      )
    );

    setMonthlyBudget(
      String(
        budget || ""
      )
    );
  }, [
    user,
    monthlySalary,
    budget,
  ]);

  const text = {
    eyebrow: isArabic
      ? "الحساب والشؤون المالية"
      : "ACCOUNT AND FINANCE",

    title: isArabic
      ? "الإعدادات"
      : "Settings",

    description: isArabic
      ? "حدّثي بيانات حسابك ومعلوماتك المالية واختاري لغة التطبيق."
      : "Update your account information, financial data, and app language.",

    languageLabel: isArabic
      ? "اللغة"
      : "LANGUAGE",

    languageTitle: isArabic
      ? "لغة التطبيق"
      : "App language",

    languageDescription: isArabic
      ? "اختاري اللغة اللي تبين تستخدمينها في CityWallet."
      : "Choose the language you want to use in CityWallet.",

    currentLanguage: isArabic
      ? "اللغة الحالية"
      : "Current language",

    english: "English",

    arabicSaudi:
      "العربية السعودية",

    switchToEnglish: isArabic
      ? "التبديل إلى الإنجليزية"
      : "Switch to English",

    switchToArabic: isArabic
      ? "التبديل إلى العربية السعودية"
      : "Switch to Saudi Arabic",

    profileLabel: isArabic
      ? "معلومات الملف الشخصي"
      : "PROFILE INFORMATION",

    accountDetails: isArabic
      ? "بيانات الحساب"
      : "Account details",

    accountDescription: isArabic
      ? "تُستخدم هذي البيانات في شريط التنقل والملف الشخصي ورسائل الترحيب."
      : "Used in the navbar, profile and welcome messages.",

    fullName: isArabic
      ? "الاسم الكامل"
      : "Full name",

    emailAddress: isArabic
      ? "البريد الإلكتروني"
      : "Email address",

    financeLabel: isArabic
      ? "المعلومات المالية"
      : "FINANCIAL INFORMATION",

    salaryAndBudget: isArabic
      ? "الراتب والميزانية"
      : "Salary and budget",

    financeDescription: isArabic
      ? "هذي القيم تتحكم في رصيدك وتقدمك المالي داخل مدينتك."
      : "These values control your balances and financial progress.",

    monthlySalary: isArabic
      ? "الراتب الشهري"
      : "Monthly salary",

    monthlyBudget: isArabic
      ? "الميزانية الشهرية"
      : "Monthly budget",

    currency: isArabic
      ? "ر.س"
      : "SAR",

    recordedExpenses: isArabic
      ? "المصروفات المسجلة"
      : "Recorded expenses",

    clearExpenses: isArabic
      ? "حذف جميع المصروفات"
      : "Clear all expenses",

    saveChanges: isArabic
      ? "حفظ التغييرات"
      : "Save Changes",

    saving: isArabic
      ? "جاري الحفظ..."
      : "Saving...",
  };

  async function handleSave(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setMessage("");
    setError("");

    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const salaryValue =
      Number(salary);

    const budgetValue =
      Number(monthlyBudget);

    if (
      cleanName.length < 2
    ) {
      setError(
        isArabic
          ? "فضلاً أدخلي اسم كامل صحيح."
          : "Please enter a valid full name."
      );

      return;
    }

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      setError(
        isArabic
          ? "فضلاً أدخلي بريد إلكتروني صحيح."
          : "Please enter a valid email address."
      );

      return;
    }

    if (
      !Number.isFinite(
        salaryValue
      ) ||
      salaryValue <= 0
    ) {
      setError(
        isArabic
          ? "فضلاً أدخلي راتب شهري صحيح."
          : "Please enter a valid monthly salary."
      );

      return;
    }

    if (
      !Number.isFinite(
        budgetValue
      ) ||
      budgetValue <= 0
    ) {
      setError(
        isArabic
          ? "فضلاً أدخلي ميزانية شهرية صحيحة."
          : "Please enter a valid monthly budget."
      );

      return;
    }

    if (
      budgetValue >
      salaryValue
    ) {
      setError(
        isArabic
          ? "الميزانية الشهرية ما تقدر تكون أكبر من الراتب الشهري."
          : "Monthly budget cannot be greater than monthly salary."
      );

      return;
    }

    setIsSaving(true);

    try {
      const result =
        await updateUser({
          name: cleanName,
          email: cleanEmail,
        });

      if (!result.success) {
        setError(
          isArabic
            ? "ما قدرنا نحدّث بيانات حسابك حاليًا. جرّبي مرة ثانية."
            : result.message
        );

        return;
      }

      setMonthlySalary(
        salaryValue
      );

      setBudget(
        budgetValue
      );

      setName(
        cleanName
      );

      setEmail(
        cleanEmail
      );

      setMessage(
        isArabic
          ? "تم تحديث بياناتك بنجاح."
          : "Your information was updated successfully."
      );
    } catch {
      setError(
        isArabic
          ? "ما قدرنا نحفظ التغييرات الحين. جرّبي مرة ثانية."
          : "Unable to save your changes right now. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClearExpenses() {
    const accepted =
      window.confirm(
        isArabic
          ? "متأكدة تبين تحذفين كل المصروفات المسجلة؟"
          : "Remove all recorded expenses?"
      );

    if (!accepted) {
      return;
    }

    clearExpenses();

    setError("");

    setMessage(
      isArabic
        ? "تم حذف جميع المصروفات."
        : "All expenses were removed."
    );
  }

  function handleLanguageChange() {
    setMessage("");
    setError("");

    if (
      language === "en-US"
    ) {
      setLanguage(
        "ar-SA"
      );

      setMessage(
        "تم تغيير اللغة إلى العربية السعودية."
      );

      return;
    }

    setLanguage(
      "en-US"
    );

    setMessage(
      "Language changed to English."
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className={styles.page}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <header
        className={styles.header}
      >
        <span>
          {text.eyebrow}
        </span>

        <h1>
          {text.title}
        </h1>

        <p>
          {text.description}
        </p>
      </header>

      {message && (
        <div
          className={
            styles.success
          }
          role="status"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className={
            styles.error
          }
          role="alert"
        >
          {error}
        </div>
      )}

      <section
        className={styles.card}
      >
        <div
          className={
            styles.cardHeader
          }
        >
          <span>
            {text.languageLabel}
          </span>

          <h2>
            {text.languageTitle}
          </h2>

          <p>
            {
              text.languageDescription
            }
          </p>
        </div>

        <div
          className={
            styles.financeSummary
          }
        >
          <div>
            <span>
              {text.currentLanguage}
            </span>

            <strong>
              {language === "ar-SA"
                ? text.arabicSaudi
                : text.english}
            </strong>
          </div>

          <button
            type="button"
            onClick={
              handleLanguageChange
            }
          >
            {isArabic
              ? text.switchToEnglish
              : text.switchToArabic}
          </button>
        </div>
      </section>

      <form
        className={styles.form}
        onSubmit={handleSave}
      >
        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <span>
              {text.profileLabel}
            </span>

            <h2>
              {text.accountDetails}
            </h2>

            <p>
              {
                text.accountDescription
              }
            </p>
          </div>

          <div
            className={
              styles.fields
            }
          >
            <label>
              <span>
                {text.fullName}
              </span>

              <input
                type="text"
                value={name}
                onChange={(
                  event
                ) =>
                  setName(
                    event.target.value
                  )
                }
                disabled={
                  isSaving
                }
                maxLength={40}
              />
            </label>

            <label>
              <span>
                {text.emailAddress}
              </span>

              <input
                type="email"
                value={email}
                onChange={(
                  event
                ) =>
                  setEmail(
                    event.target.value
                  )
                }
                disabled={
                  isSaving
                }
              />
            </label>
          </div>
        </section>

        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <span>
              {text.financeLabel}
            </span>

            <h2>
              {
                text.salaryAndBudget
              }
            </h2>

            <p>
              {
                text.financeDescription
              }
            </p>
          </div>

          <div
            className={
              styles.fields
            }
          >
            <label>
              <span>
                {
                  text.monthlySalary
                }
              </span>

              <div
                className={
                  styles.moneyInput
                }
              >
                <input
                  type="number"
                  min="1"
                  value={salary}
                  onChange={(
                    event
                  ) =>
                    setSalary(
                      event.target.value
                    )
                  }
                  disabled={
                    isSaving
                  }
                />

                <strong>
                  {text.currency}
                </strong>
              </div>
            </label>

            <label>
              <span>
                {
                  text.monthlyBudget
                }
              </span>

              <div
                className={
                  styles.moneyInput
                }
              >
                <input
                  type="number"
                  min="1"
                  value={
                    monthlyBudget
                  }
                  onChange={(
                    event
                  ) =>
                    setMonthlyBudget(
                      event.target.value
                    )
                  }
                  disabled={
                    isSaving
                  }
                />

                <strong>
                  {text.currency}
                </strong>
              </div>
            </label>
          </div>

          <div
            className={
              styles.financeSummary
            }
          >
            <div>
              <span>
                {
                  text.recordedExpenses
                }
              </span>

              <strong>
                {expenses.length}
              </strong>
            </div>

            <button
              type="button"
              onClick={
                handleClearExpenses
              }
              disabled={
                isSaving
              }
            >
              {
                text.clearExpenses
              }
            </button>
          </div>
        </section>

        <button
          type="submit"
          className={
            styles.saveButton
          }
          disabled={
            isSaving
          }
        >
          {isSaving
            ? text.saving
            : text.saveChanges}
        </button>
      </form>
    </div>
  );
}