"use client";

import Link from "next/link";

import {
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import {
  useLanguage,
} from "@/context/LanguageContext";

import LanguageSwitcher from "@/components/LanguageSwitcher";

import styles from "./page.module.css";

export default function Home() {
  const {
    isArabic,
  } = useLanguage();

  const [
    tilt,
    setTilt,
  ] = useState({
    x: 0,
    y: 0,
  });

  function handleMouseMove(
    event:
      MouseEvent<HTMLDivElement>
  ) {
    const rect =
      event.currentTarget
        .getBoundingClientRect();

    const mouseX =
      event.clientX -
      rect.left;

    const mouseY =
      event.clientY -
      rect.top;

    const rotateY =
      (
        mouseX /
          rect.width -
        0.5
      ) * 7;

    const rotateX =
      (
        mouseY /
          rect.height -
        0.5
      ) * -5;

    setTilt({
      x: rotateX,
      y: rotateY,
    });
  }

  function resetTilt() {
    setTilt({
      x: 0,
      y: 0,
    });
  }

  const cityStyle = {
    "--rotate-x":
      `${tilt.x}deg`,

    "--rotate-y":
      `${tilt.y}deg`,
  } as CSSProperties;

  const text = {
    home: isArabic
      ? "الرئيسية"
      : "Home",

    how: isArabic
      ? "كيف تشتغل؟"
      : "How it works",

    features: isArabic
      ? "المميزات"
      : "Features",

    login: isArabic
      ? "تسجيل الدخول"
      : "Login",

    eyebrow: isArabic
      ? "لعبة بناء مدينة مالية"
      : "FINANCIAL CITY-BUILDING GAME",

    titleFirst: isArabic
      ? "ابنِ"
      : "Build your",

    titleSecond: isArabic
      ? " مدينتك المالية."
      : " financial city.",

    description: isArabic
      ? "كل قرار مالي تسويه يغيّر مدينتك. وفّر بذكاء، اضبط صرفك، وشوف عالمك وهو يكبر معك."
      : "Every financial decision you make shapes your city. Save smarter, control your spending, and watch your world grow.",

    start: isArabic
      ? "ابدأ اللعب"
      : "Start Game",

    returnCity: isArabic
      ? "ارجع لمدينتي"
      : "Return to My City",

    hint: isArabic
      ? "مدينتك تنتظرك."
      : "Your city is waiting for its mayor.",

    howLabel: isArabic
      ? "كيف تشتغل؟"
      : "HOW IT WORKS",

    howTitle: isArabic
      ? "قراراتك المالية تصير جزء من عالمك."
      : "Your money decisions become your world.",

    trackTitle: isArabic
      ? "تابع صرفك"
      : "Track your spending",

    trackDescription: isArabic
      ? "اعرف وين تروح فلوسك وخلك متحكم بميزانيتك الشهرية."
      : "Understand where your money goes and keep control of your monthly budget.",

    cityTitle: isArabic
      ? "شكّل مدينتك"
      : "Shape your city",

    cityDescription: isArabic
      ? "كل ما تحسّنت قراراتك المالية، مدينتك تكبر وتتطور وتصير أكثر حياة."
      : "Better financial decisions help your city grow, improve, and become more alive.",

    habitsTitle: isArabic
      ? "ابنِ عادات أفضل"
      : "Build better habits",

    habitsDescription: isArabic
      ? "أنجز التحديات واستفد من التحليلات المالية عشان تتخذ قرارات أحسن مع الوقت."
      : "Complete challenges and use financial insights to make better decisions over time.",

    ctaLabel: isArabic
      ? "مدينتك تبدأ صغيرة"
      : "YOUR CITY STARTS SMALL",

    ctaTitle: isArabic
      ? "والباقي تبنيه قراراتك."
      : "The rest is built by your decisions.",

    ctaButton: isArabic
      ? "ابدأ مدينتك"
      : "Become the Mayor",
  };

  return (
    <main
      className={styles.page}
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.logo}
        >
          <span
            className={
              styles.logoMark
            }
          >
            C
          </span>

          <span>
            CityWallet
          </span>
        </Link>

        <nav className={styles.nav}>
          <LanguageSwitcher />

          <Link href="/">
            {text.home}
          </Link>

          <Link href="#how">
            {text.how}
          </Link>

          <Link href="#features">
            {text.features}
          </Link>

          <Link
            href="/login"
            className={
              styles.navLogin
            }
          >
            {text.login}
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span
            className={
              styles.eyebrow
            }
          >
            {text.eyebrow}
          </span>

          <h1>
            {text.titleFirst}

            <span>
              {text.titleSecond}
            </span>
          </h1>

          <p>
            {text.description}
          </p>

          <div className={styles.actions}>
            <Link
              href="/register"
              className={
                styles.startButton
              }
            >
              {text.start}
            </Link>

            <Link
              href="/login"
              className={
                styles.secondaryButton
              }
            >
              {text.returnCity}
            </Link>
          </div>

          <div
            className={
              styles.gameHint
            }
          >
            <span />

            {text.hint}
          </div>
        </div>

        <div
          className={
            styles.cityStage
          }
          onMouseMove={
            handleMouseMove
          }
          onMouseLeave={
            resetTilt
          }
        >
          <div
            className={
              styles.cityWorld
            }
            style={cityStyle}
          >
            <div
              className={`${styles.cloud} ${styles.cloudOne}`}
            />

            <div
              className={`${styles.cloud} ${styles.cloudTwo}`}
            />

            <div
              className={styles.sun}
            />

            <div
              className={
                styles.cityIsland
              }
            >
              <div
                className={
                  styles.grass
                }
              />

              <div
                className={
                  styles.roadHorizontal
                }
              />

              <div
                className={
                  styles.roadVertical
                }
              />

              <div
                className={
                  styles.house
                }
              >
                <div
                  className={
                    styles.houseRoof
                  }
                />

                <span
                  className={
                    styles.houseDoor
                  }
                />

                <span
                  className={
                    styles.houseWindow
                  }
                />
              </div>

              <div
                className={
                  styles.bank
                }
              >
                <div
                  className={
                    styles.bankRoof
                  }
                />

                <div
                  className={
                    styles.bankSign
                  }
                >
                  BANK
                </div>

                <span />
                <span />
                <span />
              </div>

              <div
                className={
                  styles.shop
                }
              >
                <span />
                <span />
              </div>

              <div
                className={`${styles.tree} ${styles.treeOne}`}
              />

              <div
                className={`${styles.tree} ${styles.treeTwo}`}
              />

              <div
                className={`${styles.tree} ${styles.treeThree}`}
              />

              <div
                className={`${styles.tree} ${styles.treeFour}`}
              />

              <div
                className={
                  styles.car
                }
              />

              <div
                className={
                  styles.citizen
                }
              >
                <span />
              </div>
            </div>

            <div
              className={
                styles.cityShadow
              }
            />
          </div>
        </div>
      </section>

      <section
        id="how"
        className={
          styles.howSection
        }
      >
        <div
          className={
            styles.sectionHeader
          }
        >
          <span>
            {text.howLabel}
          </span>

          <h2>
            {text.howTitle}
          </h2>
        </div>

        <div
          className={
            styles.featureGrid
          }
        >
          <article>
            <div
              className={
                styles.number
              }
            >
              01
            </div>

            <h3>
              {text.trackTitle}
            </h3>

            <p>
              {
                text.trackDescription
              }
            </p>
          </article>

          <article>
            <div
              className={
                styles.number
              }
            >
              02
            </div>

            <h3>
              {text.cityTitle}
            </h3>

            <p>
              {
                text.cityDescription
              }
            </p>
          </article>

          <article>
            <div
              className={
                styles.number
              }
            >
              03
            </div>

            <h3>
              {text.habitsTitle}
            </h3>

            <p>
              {
                text.habitsDescription
              }
            </p>
          </article>
        </div>
      </section>

      <section
        id="features"
        className={
          styles.ctaSection
        }
      >
        <span>
          {text.ctaLabel}
        </span>

        <h2>
          {text.ctaTitle}
        </h2>

        <Link
          href="/register"
          className={
            styles.ctaButton
          }
        >
          {text.ctaButton}
        </Link>
      </section>
    </main>
  );
}