"use client";

import type { CSSProperties } from "react";
import type { BuildingType } from "../data/buildings";
import styles from "./Building.module.css";

type CityCondition = "healthy" | "warning" | "destroyed";

type BuildingProps = {
  name: string;
  type: BuildingType;
  color: string;
  spent: number;
  percent: number;
  cityCondition: CityCondition;
  onClick: () => void;
};

function Restaurant() {
  return (
    <div className={styles.restaurant}>
      <div className={styles.restaurantRoof}></div>
      <div className={styles.restaurantSign}>RESTAURANT</div>

      <div className={styles.restaurantWindows}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.awning}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.restaurantBottom}>
        <span></span>
        <div></div>
        <span></span>
      </div>
    </div>
  );
}

function Mall() {
  return (
    <div className={styles.mall}>
      <div className={styles.mallSign}>SHOPPING MALL</div>

      <div className={styles.mallWindows}>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>

      <div className={styles.mallEntrance}>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function Transport() {
  return (
    <div className={styles.transport}>
      <div className={styles.transportSign}>TRANSPORT</div>
      <div className={styles.transportCanopy}></div>

      <div className={styles.transportOffice}>
        <span></span>
        <div></div>
      </div>

      <div className={styles.pumps}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function Utilities() {
  return (
    <div className={styles.utilities}>
      <div className={styles.chimneys}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.chimneySmoke}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.utilityBuilding}>
        <div className={styles.utilitySign}>UTILITIES</div>

        <div className={styles.utilityWindows}>
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>

        <div className={styles.utilityDoor}></div>
      </div>
    </div>
  );
}

function Cinema() {
  return (
    <div className={styles.cinema}>
      <div className={styles.cinemaSign}>CINEMA</div>

      <div className={styles.cinemaLights}>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>

      <div className={styles.posters}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={styles.cinemaDoors}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function Hospital() {
  return (
    <div className={styles.hospital}>
      <div className={styles.hospitalCross}>
        <span></span>
        <span></span>
      </div>

      <div className={styles.hospitalWindows}>
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>

      <div className={styles.hospitalDoor}></div>

      <div className={styles.hospitalWingLeft}></div>
      <div className={styles.hospitalWingRight}></div>
    </div>
  );
}

function School() {
  return (
    <div className={styles.school}>
      <div className={styles.schoolRoof}></div>
      <div className={styles.schoolClock}></div>
      <div className={styles.schoolSign}>SCHOOL</div>

      <div className={styles.schoolWindows}>
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>

      <div className={styles.schoolDoor}></div>
    </div>
  );
}

function House() {
  return (
    <div className={styles.house}>
      <div className={styles.houseRoof}>
        <span></span>
      </div>

      <div className={styles.houseBody}>
        <div className={styles.houseWindowLeft}></div>
        <div className={styles.houseWindowRight}></div>
        <div className={styles.houseDoor}></div>
      </div>

      <div className={styles.fence}>
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>
    </div>
  );
}

function BuildingShape({ type }: { type: BuildingType }) {
  switch (type) {
    case "restaurant":
      return <Restaurant />;

    case "mall":
      return <Mall />;

    case "transport":
      return <Transport />;

    case "utilities":
      return <Utilities />;

    case "cinema":
      return <Cinema />;

    case "hospital":
      return <Hospital />;

    case "school":
      return <School />;

    case "house":
      return <House />;
  }
}

export default function Building({
  name,
  type,
  color,
  spent,
  percent,
  cityCondition,
  onClick,
}: BuildingProps) {
  const condition: CityCondition =
    cityCondition === "destroyed" || percent >= 35
      ? "destroyed"
      : cityCondition === "warning" || percent >= 20
        ? "warning"
        : "healthy";

  const cssVariables = {
    "--accent": color,
  } as CSSProperties;

  return (
    <article
      className={`${styles.lot} ${styles[condition]}`}
      style={cssVariables}
    >
      <div className={styles.label}>
        <strong>{name}</strong>
        <span>{percent}%</span>
      </div>

      <button
        type="button"
        className={styles.buildingButton}
        onClick={onClick}
      >
        <div className={styles.structure}>
          <BuildingShape type={type} />

          <div className={styles.damage}>
            <span className={styles.crackOne}></span>
            <span className={styles.crackTwo}></span>
            <span className={styles.crackThree}></span>

            <div className={styles.brokenSection}></div>

            <div className={styles.mold}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.rubble}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.fire}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.smoke}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <div className={styles.tooltip}>
          <strong>{name}</strong>
          <span>{spent.toLocaleString()} SAR</span>
          <small>Click to view expenses</small>
        </div>
      </button>
    </article>
  );
}