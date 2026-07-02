"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useBudget,
} from "@/context/BudgetContext";

import {
  useGame,
} from "@/context/GameContext";

import {
  getBuildings,
} from "../data/buildings";

import Building from "./Building";
import ExpensePanel from "./ExpensePanel";
import CityGameHUD from "./CityGameHUD";

import styles from "./CityView.module.css";

type CityCondition =
  | "healthy"
  | "warning"
  | "destroyed";

export default function CityView() {
  const pathname = usePathname();

  const {
    budget,
    expenses,
    totalSpent,
  } = useBudget();

  const {
    parkUnlocked,
  } = useGame();

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const ratio =
    budget > 0
      ? totalSpent / budget
      : 0;

  const condition: CityCondition =
    ratio >= 1
      ? "destroyed"
      : ratio >= 0.7
        ? "warning"
        : "healthy";

  const buildings = useMemo(
    () =>
      getBuildings(
        expenses,
        budget
      ),
    [expenses, budget]
  );

  const budgetPercent = Math.min(
    Math.round(ratio * 100),
    999
  );

  const isFullScreen =
    pathname === "/city/full";

  return (
    <>
      <ExpensePanel
        open={
          selectedCategory !== ""
        }
        category={
          selectedCategory
        }
        onClose={() =>
          setSelectedCategory("")
        }
      />

      <section
        className={`${styles.city} ${
          styles[condition]
        }`}
      >
        <header
          className={styles.cityHeader}
        >
          <div
            className={styles.healthCard}
          >
            <span>City Health</span>

            <strong>
              {condition ===
                "healthy" &&
                "Thriving"}

              {condition ===
                "warning" &&
                "Warning"}

              {condition ===
                "destroyed" &&
                "Critical"}
            </strong>

            <div
              className={
                styles.healthBar
              }
            >
              <div
                style={{
                  width: `${Math.min(
                    budgetPercent,
                    100
                  )}%`,
                }}
              ></div>
            </div>

            <small>
              {budgetPercent}% of
              monthly budget used
            </small>
          </div>

          <Link
            href={
              isFullScreen
                ? "/city"
                : "/city/full"
            }
            className={
              styles.fullButton
            }
          >
            {isFullScreen
              ? "Back to dashboard"
              : "Open full city"}
          </Link>
        </header>

        <CityGameHUD />

        <div className={styles.sky}>
          <div
            className={styles.sun}
          ></div>

          <div
            className={`${styles.cloud} ${styles.cloudOne}`}
          ></div>

          <div
            className={`${styles.cloud} ${styles.cloudTwo}`}
          ></div>

          <div
            className={`${styles.cloud} ${styles.cloudThree}`}
          ></div>

          <div
            className={`${styles.stormCloud} ${styles.stormOne}`}
          ></div>

          <div
            className={`${styles.stormCloud} ${styles.stormTwo}`}
          ></div>

          <div
            className={
              styles.lightning
            }
          ></div>

          <div
            className={styles.rain}
          ></div>

          <div
            className={styles.birds}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div
          className={styles.mountains}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div
          className={styles.grass}
        ></div>

        <div
          className={styles.backTrees}
        >
          {Array.from({
            length: 11,
          }).map((_, index) => (
            <div
              className={styles.tree}
              key={`back-tree-${index}`}
            >
              <span
                className={styles.trunk}
              ></span>

              <span
                className={
                  styles.branchOne
                }
              ></span>

              <span
                className={
                  styles.branchTwo
                }
              ></span>

              <span
                className={
                  styles.leafOne
                }
              ></span>

              <span
                className={
                  styles.leafTwo
                }
              ></span>

              <span
                className={
                  styles.leafThree
                }
              ></span>

              <span
                className={
                  styles.deadBranchOne
                }
              ></span>

              <span
                className={
                  styles.deadBranchTwo
                }
              ></span>

              <span
                className={
                  styles.treeMold
                }
              ></span>
            </div>
          ))}
        </div>

        <div
          className={styles.buildings}
        >
          {buildings.map(
            (building) => (
              <Building
                key={building.name}
                name={building.name}
                type={building.type}
                color={building.color}
                spent={building.spent}
                percent={
                  building.percent
                }
                cityCondition={
                  condition
                }
                onClick={() =>
                  setSelectedCategory(
                    building.name
                  )
                }
              />
            )
          )}
        </div>

        <div
          className={styles.frontTrees}
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              className={styles.tree}
              key={`front-tree-${index}`}
            >
              <span
                className={styles.trunk}
              ></span>

              <span
                className={
                  styles.branchOne
                }
              ></span>

              <span
                className={
                  styles.branchTwo
                }
              ></span>

              <span
                className={
                  styles.leafOne
                }
              ></span>

              <span
                className={
                  styles.leafTwo
                }
              ></span>

              <span
                className={
                  styles.leafThree
                }
              ></span>

              <span
                className={
                  styles.deadBranchOne
                }
              ></span>

              <span
                className={
                  styles.deadBranchTwo
                }
              ></span>

              <span
                className={
                  styles.treeMold
                }
              ></span>
            </div>
          ))}
        </div>

        <div
          className={styles.park}
          style={{
            opacity:
              parkUnlocked ? 1 : 0.35,

            filter:
              parkUnlocked
                ? "none"
                : "grayscale(0.8)",

            transition:
              "opacity 0.4s ease, filter 0.4s ease",
          }}
        >
          <div className={styles.pond}>
            <span></span>
          </div>

          <div
            className={styles.parkPath}
          ></div>

          <div
            className={styles.bench}
          >
            <span></span>
            <span></span>
          </div>

          <div
            className={styles.flowers}
          >
            {Array.from({
              length: 14,
            }).map((_, index) => (
              <span
                key={index}
              ></span>
            ))}
          </div>

          {!parkUnlocked && (
            <div
              style={{
                position: "absolute",
                inset: "0",
                zIndex: 20,

                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",

                color: "#172033",

                fontSize: "12px",
                fontWeight: 800,

                pointerEvents: "none",
              }}
            >
              🔒 Defeat Weekly Monster
            </div>
          )}
        </div>

        <div className={styles.road}>
          <div
            className={styles.roadLine}
          ></div>

          <div
            className={`${styles.car} ${styles.carOne}`}
          >
            <span
              className={styles.carBody}
            ></span>

            <span
              className={styles.carRoof}
            ></span>

            <span
              className={styles.wheelOne}
            ></span>

            <span
              className={styles.wheelTwo}
            ></span>
          </div>

          <div
            className={`${styles.car} ${styles.carTwo}`}
          >
            <span
              className={styles.carBody}
            ></span>

            <span
              className={styles.carRoof}
            ></span>

            <span
              className={styles.wheelOne}
            ></span>

            <span
              className={styles.wheelTwo}
            ></span>
          </div>

          <div
            className={
              styles.wreckedCar
            }
          >
            <span
              className={styles.wreckBody}
            ></span>

            <span
              className={styles.wreckRoof}
            ></span>

            <span
              className={
                styles.wreckWheelOne
              }
            ></span>

            <span
              className={
                styles.wreckWheelTwo
              }
            ></span>

            <div
              className={
                styles.wreckFire
              }
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div
              className={
                styles.wreckSmoke
              }
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div
          className={styles.overlay}
        ></div>
      </section>
    </>
  );
}