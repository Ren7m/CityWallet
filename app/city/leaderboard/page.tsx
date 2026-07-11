"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";

import styles from "./leaderboard.module.css";

/* =========================
   TYPES
========================= */

type RankingTab =
  | "global"
  | "friends";

type Friend = {
  id: string;
  name: string;
  email: string;
  initials: string;
  level: number;
  points: number;
  position: number | null;
};

/* =========================
   ICONS
========================= */

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 4h8v3a4 4 0 0 1-8 0V4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 6H5v1a4 4 0 0 0 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16 6h3v1a4 4 0 0 1-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 11v5M9 20h6M10 16h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.5 18c.7-3 2.6-4.5 5.5-4.5s4.8 1.5 5.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16 6.5a2.5 2.5 0 0 1 0 5M17 14c2 .4 3.2 1.7 3.5 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m16 16 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddUserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.5 18c.7-3 2.6-4.5 5.5-4.5s4.8 1.5 5.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M18 8v6M15 11h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="14"
        r="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M9 3h6l-1 6h-4L9 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="m12 3 1.2 4.3L17 9l-3.8 1.7L12 15l-1.2-4.3L7 9l3.8-1.7L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="m18.5 14 .6 2 1.9.8-1.9.8-.6 2-.6-2-1.9-.8 1.9-.8.6-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================
   HELPERS
========================= */

function getInitials(
  name: string
) {
  const cleanName = name.trim();

  if (!cleanName) {
    return "M";
  }

  const parts = cleanName
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .charAt(0)
      .toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[
      parts.length - 1
    ].charAt(0)
  ).toUpperCase();
}

/* =========================
   PAGE
========================= */

export default function LeaderboardPage() {
  const {
    user,
  } = useAuth();

  const {
    xp,
    coins,
    level,
  } = useGame();

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<RankingTab>(
      "global"
    );

  const [
    friendSearch,
    setFriendSearch,
  ] = useState("");

  const [
    friends,
  ] = useState<Friend[]>(
    []
  );

  const [
    message,
    setMessage,
  ] = useState("");

  const formatter =
    useMemo(
      () =>
        new Intl.NumberFormat(
          "en-US"
        ),
      []
    );

  const currentUserName =
    user?.name?.trim() ||
    "Mayor";

  const currentUserEmail =
    user?.email || "";

  const currentUserInitials =
    user?.initials ||
    getInitials(
      currentUserName
    );

  /*
    لا نضع ترتيبًا وهميًا.

    عندما نربط Supabase بجدول profiles
    سيتم جلب Position الحقيقي من جميع
    المستخدمين.
  */

  const currentPosition:
    number | null = null;

  function handleAddFriend(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanSearch =
      friendSearch.trim();

    if (!cleanSearch) {
      setMessage(
        "Enter a username or email address."
      );

      return;
    }

    /*
      لا نضيف صديقًا وهميًا إلى القائمة.

      الخطوة القادمة:
      البحث الحقيقي في Supabase ثم إرسال
      Friend Request حقيقية.
    */

    setMessage(
      "Friend search is ready for the Supabase connection."
    );
  }

  const visiblePlayers =
    useMemo(() => {
      if (
        activeTab === "friends"
      ) {
        return friends;
      }

      return [];
    }, [
      activeTab,
      friends,
    ]);

  return (
    <main
      className={styles.page}
    >
      {/* =====================
          HERO
      ===================== */}

      <section
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.heroContent
          }
        >
          <span
            className={
              styles.eyebrow
            }
          >
            <TrophyIcon />

            CITYWALLET RANKINGS
          </span>

          <h1>
            Leaderboard
          </h1>

          <p>
            Track your position,
            compare progress and
            connect with friends.
          </p>
        </div>

        <div
          className={
            styles.heroBadge
          }
        >
          <div
            className={
              styles.heroBadgeIcon
            }
          >
            <MedalIcon />
          </div>

          <div>
            <span>
              Your position
            </span>

            <strong>
              {currentPosition
                ? `#${currentPosition}`
                : "—"}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================
          YOUR STANDING
      ===================== */}

      <section
        className={
          styles.standingGrid
        }
      >
        <article
          className={`${styles.statCard} ${styles.rankCard}`}
        >
          <div
            className={
              styles.statIcon
            }
          >
            <TrophyIcon />
          </div>

          <div
            className={
              styles.statInfo
            }
          >
            <span>
              Your Position
            </span>

            <strong>
              {currentPosition
                ? `#${currentPosition}`
                : "—"}
            </strong>

            <p>
              Ranking activates when
              real leaderboard data is
              connected.
            </p>
          </div>
        </article>

        <article
          className={`${styles.statCard} ${styles.pointsCard}`}
        >
          <div
            className={
              styles.statIcon
            }
          >
            <SparkIcon />
          </div>

          <div
            className={
              styles.statInfo
            }
          >
            <span>
              Your Points
            </span>

            <strong>
              {formatter.format(xp)}
            </strong>

            <p>
              Real XP earned from your
              CityWallet activity.
            </p>
          </div>
        </article>

        <article
          className={`${styles.statCard} ${styles.levelCard}`}
        >
          <div
            className={
              styles.statIcon
            }
          >
            <MedalIcon />
          </div>

          <div
            className={
              styles.statInfo
            }
          >
            <span>
              Player Level
            </span>

            <strong>
              Level {level}
            </strong>

            <p>
              Based on your current
              game progress.
            </p>
          </div>
        </article>

        <article
          className={`${styles.statCard} ${styles.friendsCard}`}
        >
          <div
            className={
              styles.statIcon
            }
          >
            <UsersIcon />
          </div>

          <div
            className={
              styles.statInfo
            }
          >
            <span>
              Friends
            </span>

            <strong>
              {friends.length}
            </strong>

            <p>
              Connected CityWallet
              players.
            </p>
          </div>
        </article>
      </section>

      {/* =====================
          MAIN GRID
      ===================== */}

      <div
        className={
          styles.mainGrid
        }
      >
        {/* =====================
            RANKING TABLE
        ===================== */}

        <section
          className={
            styles.rankingPanel
          }
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <span
                className={
                  styles.sectionLabel
                }
              >
                <TrophyIcon />

                PLAYER RANKINGS
              </span>

              <h2>
                Ranking Board
              </h2>

              <p>
                Compare real progress
                between CityWallet
                players.
              </p>
            </div>

            <div
              className={
                styles.tabs
              }
            >
              <button
                type="button"
                className={
                  activeTab ===
                  "global"
                    ? styles.activeTab
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "global"
                  )
                }
              >
                Global
              </button>

              <button
                type="button"
                className={
                  activeTab ===
                  "friends"
                    ? styles.activeTab
                    : ""
                }
                onClick={() =>
                  setActiveTab(
                    "friends"
                  )
                }
              >
                Friends
              </button>
            </div>
          </div>

          <div
            className={
              styles.tableHeader
            }
          >
            <span>
              Position
            </span>

            <span>
              Player
            </span>

            <span>
              Level
            </span>

            <span>
              Points
            </span>
          </div>

          {/* CURRENT USER */}

          <article
            className={`${styles.playerRow} ${styles.currentPlayerRow}`}
          >
            <div
              className={
                styles.position
              }
            >
              {currentPosition
                ? `#${currentPosition}`
                : "—"}
            </div>

            <div
              className={
                styles.player
              }
            >
              <div
                className={
                  styles.avatar
                }
              >
                {
                  currentUserInitials
                }
              </div>

              <div>
                <strong>
                  {currentUserName}
                </strong>

                <span>
                  You
                </span>
              </div>
            </div>

            <div
              className={
                styles.levelBadge
              }
            >
              Lv. {level}
            </div>

            <div
              className={
                styles.points
              }
            >
              <strong>
                {formatter.format(
                  xp
                )}
              </strong>

              <span>
                XP
              </span>
            </div>
          </article>

          {visiblePlayers.length >
          0 ? (
            visiblePlayers.map(
              (player) => (
                <article
                  className={
                    styles.playerRow
                  }
                  key={
                    player.id
                  }
                >
                  <div
                    className={
                      styles.position
                    }
                  >
                    {player.position
                      ? `#${player.position}`
                      : "—"}
                  </div>

                  <div
                    className={
                      styles.player
                    }
                  >
                    <div
                      className={
                        styles.avatar
                      }
                    >
                      {
                        player.initials
                      }
                    </div>

                    <div>
                      <strong>
                        {
                          player.name
                        }
                      </strong>

                      <span>
                        {
                          player.email
                        }
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.levelBadge
                    }
                  >
                    Lv.{" "}
                    {
                      player.level
                    }
                  </div>

                  <div
                    className={
                      styles.points
                    }
                  >
                    <strong>
                      {formatter.format(
                        player.points
                      )}
                    </strong>

                    <span>
                      XP
                    </span>
                  </div>
                </article>
              )
            )
          ) : (
            <div
              className={
                styles.emptyRanking
              }
            >
              <div
                className={
                  styles.emptyIcon
                }
              >
                {activeTab ===
                "global" ? (
                  <TrophyIcon />
                ) : (
                  <UsersIcon />
                )}
              </div>

              <strong>
                {activeTab ===
                "global"
                  ? "Global rankings are waiting for real player data"
                  : "No friends added yet"}
              </strong>

              <p>
                {activeTab ===
                "global"
                  ? "Your own XP is already real. Other players will appear after connecting the leaderboard to Supabase."
                  : "Use the Add Friend panel to connect with another CityWallet player."}
              </p>
            </div>
          )}
        </section>

        {/* =====================
            RIGHT COLUMN
        ===================== */}

        <aside
          className={
            styles.sideColumn
          }
        >
          {/* ADD FRIEND */}

          <section
            className={
              styles.friendPanel
            }
          >
            <div
              className={
                styles.friendPanelTop
              }
            >
              <div
                className={
                  styles.friendIcon
                }
              >
                <AddUserIcon />
              </div>

              <div>
                <span>
                  CITY CONNECTIONS
                </span>

                <h2>
                  Add a Friend
                </h2>
              </div>
            </div>

            <p
              className={
                styles.friendDescription
              }
            >
              Search for another
              CityWallet player by email
              or username.
            </p>

            <form
              className={
                styles.friendForm
              }
              onSubmit={
                handleAddFriend
              }
            >
              <label
                className={
                  styles.searchField
                }
              >
                <SearchIcon />

                <input
                  type="text"
                  value={
                    friendSearch
                  }
                  onChange={(
                    event
                  ) => {
                    setFriendSearch(
                      event.target
                        .value
                    );

                    setMessage("");
                  }}
                  placeholder="Email or username"
                />
              </label>

              <button
                type="submit"
                className={
                  styles.addButton
                }
              >
                <AddUserIcon />

                Add Friend
              </button>
            </form>

            {message && (
              <div
                className={
                  styles.message
                }
                role="status"
              >
                {message}
              </div>
            )}
          </section>

          {/* PLAYER CARD */}

          <section
            className={
              styles.profilePanel
            }
          >
            <span
              className={
                styles.profileLabel
              }
            >
              YOUR PLAYER CARD
            </span>

            <div
              className={
                styles.profileMain
              }
            >
              <div
                className={
                  styles.largeAvatar
                }
              >
                {
                  currentUserInitials
                }
              </div>

              <div>
                <strong>
                  {
                    currentUserName
                  }
                </strong>

                <span>
                  {currentUserEmail ||
                    "CityWallet player"}
                </span>
              </div>
            </div>

            <div
              className={
                styles.profileStats
              }
            >
              <div>
                <span>
                  Level
                </span>

                <strong>
                  {level}
                </strong>
              </div>

              <div>
                <span>
                  XP
                </span>

                <strong>
                  {formatter.format(
                    xp
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Coins
                </span>

                <strong>
                  {formatter.format(
                    coins
                  )}
                </strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}