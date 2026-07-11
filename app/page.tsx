"use client";

import Link from "next/link";
import {
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import styles from "./page.module.css";

export default function Home() {
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
  });

  function handleMouseMove(
    event: MouseEvent<HTMLDivElement>
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const mouseX =
      event.clientX - rect.left;

    const mouseY =
      event.clientY - rect.top;

    const rotateY =
      (mouseX / rect.width - 0.5) * 7;

    const rotateX =
      (mouseY / rect.height - 0.5) * -5;

    setTilt({
      x: rotateX,
      y: rotateY,
    });
  }

  const cityStyle = {
    "--rotate-x": `${tilt.x}deg`,
    "--rotate-y": `${tilt.y}deg`,
  } as CSSProperties;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link
          href="/"
          className={styles.logo}
        >
          <span className={styles.logoMark}>
            C
          </span>

          <span>CityWallet</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/">Home</Link>

          <Link href="#how">
            How it works
          </Link>

          <Link href="#features">
            Features
          </Link>

          <Link
            href="/login"
            className={styles.navLogin}
          >
            Login
          </Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            FINANCIAL CITY-BUILDING GAME
          </span>

          <h1>
            Build your
            <span> financial city.</span>
          </h1>

          <p>
            Every financial decision you make
            shapes your city. Save smarter,
            control your spending, and watch
            your world grow.
          </p>

          <div className={styles.actions}>
            <Link
              href="/register"
              className={styles.startButton}
            >
              Start Game
            </Link>

            <Link
              href="/login"
              className={styles.secondaryButton}
            >
              Return to My City
            </Link>
          </div>

          <div className={styles.gameHint}>
            <span></span>

            Your city is waiting for its mayor.
          </div>
        </div>

        <div
          className={styles.cityStage}
          onMouseMove={handleMouseMove}
          onMouseLeave={() =>
            setTilt({
              x: 0,
              y: 0,
            })
          }
        >
          <div
            className={styles.cityWorld}
            style={cityStyle}
          >
            <div
              className={`${styles.cloud} ${styles.cloudOne}`}
            ></div>

            <div
              className={`${styles.cloud} ${styles.cloudTwo}`}
            ></div>

            <div className={styles.sun}></div>

            <div className={styles.cityIsland}>
              <div className={styles.grass}></div>

              <div
                className={styles.roadHorizontal}
              ></div>

              <div
                className={styles.roadVertical}
              ></div>

              <div className={styles.house}>
                <div
                  className={styles.houseRoof}
                ></div>

                <span
                  className={styles.houseDoor}
                ></span>

                <span
                  className={styles.houseWindow}
                ></span>
              </div>

              <div className={styles.bank}>
                <div
                  className={styles.bankRoof}
                ></div>

                <div
                  className={styles.bankSign}
                >
                  BANK
                </div>

                <span></span>
                <span></span>
                <span></span>
              </div>

              <div
                className={styles.shop}
              >
                <span></span>
                <span></span>
              </div>

              <div
                className={`${styles.tree} ${styles.treeOne}`}
              ></div>

              <div
                className={`${styles.tree} ${styles.treeTwo}`}
              ></div>

              <div
                className={`${styles.tree} ${styles.treeThree}`}
              ></div>

              <div
                className={`${styles.tree} ${styles.treeFour}`}
              ></div>

              <div
                className={styles.car}
              ></div>

              <div
                className={styles.citizen}
              >
                <span></span>
              </div>
            </div>

            <div className={styles.cityShadow}></div>
          </div>
        </div>
      </section>

      <section
        id="how"
        className={styles.howSection}
      >
        <div className={styles.sectionHeader}>
          <span>HOW IT WORKS</span>

          <h2>
            Your money decisions become
            your world.
          </h2>
        </div>

        <div className={styles.featureGrid}>
          <article>
            <div className={styles.number}>
              01
            </div>

            <h3>Track your spending</h3>

            <p>
              Understand where your money goes
              and keep control of your monthly
              budget.
            </p>
          </article>

          <article>
            <div className={styles.number}>
              02
            </div>

            <h3>Shape your city</h3>

            <p>
              Better financial decisions help
              your city grow, improve, and
              become more alive.
            </p>
          </article>

          <article>
            <div className={styles.number}>
              03
            </div>

            <h3>Build better habits</h3>

            <p>
              Complete challenges and use
              financial insights to make better
              decisions over time.
            </p>
          </article>
        </div>
      </section>

      <section
        id="features"
        className={styles.ctaSection}
      >
        <span>
          YOUR CITY STARTS SMALL
        </span>

        <h2>
          The rest is built by your decisions.
        </h2>

        <Link
          href="/register"
          className={styles.ctaButton}
        >
          Become the Mayor
        </Link>
      </section>
    </main>
  );
}