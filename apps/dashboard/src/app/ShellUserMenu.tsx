import type {CSSProperties} from "react";
import {createPortal} from "react-dom";
import {NavLink} from "react-router-dom";

import type {SessionUser} from "@/features/auth/auth-credentials";
import {useI18n} from "@/shared/preferences/PreferencesProvider";

import {useShellUserMenu} from "./useShellUserMenu";

import styles from "./ShellUserMenu.module.scss";

type ShellUserMenuProps = {
  user: SessionUser;
  collapsed: boolean;
  onSignOut: () => void;
};

export function ShellUserMenu({user, collapsed, onSignOut}: ShellUserMenuProps) {
  const menu = useShellUserMenu();
  const {t} = useI18n();

  return (
    <div
      className={`${styles.root} ${collapsed ? styles["root-collapsed"] : ""}`}
      onMouseEnter={menu.onPointerEnter}
      onMouseLeave={menu.onPointerLeave}
      ref={menu.rootRef}
    >
      <button
        aria-expanded={menu.open}
        aria-haspopup="menu"
        className={styles.trigger}
        onClick={menu.openMenu}
        onFocus={menu.openMenu}
        title={collapsed ? user.displayName : undefined}
        type="button"
      >
        <span className={styles.avatar} aria-hidden="true">
          {user.avatarUrl ? (
            <img
              alt=""
              className={styles["avatar-image"]}
              height={32}
              src={user.avatarUrl}
              width={32}
            />
          ) : (
            user.displayName.slice(0, 1)
          )}
        </span>
        <span className={styles.copy}>
          <span className={styles.name}>{user.displayName}</span>
          <span className={styles.handle}>@{user.handle}</span>
        </span>
        <span
          className={`${styles.chevron} ${menu.open ? styles["chevron-open"] : ""}`}
          aria-hidden="true"
        >
          <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
            <path
              d="M5.25 3.5 8.75 7 5.25 10.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </button>
      {menu.open && menu.position
        ? createPortal(
            <div
              className={styles.menu}
              onMouseEnter={menu.onPointerEnter}
              onMouseLeave={menu.onPointerLeave}
              ref={menu.menuRef}
              role="menu"
              style={
                {
                  left: menu.position.left,
                  bottom: menu.position.bottom,
                  "--shell-menu-bridge": `${menu.bridgePx}px`,
                } as CSSProperties
              }
            >
              <NavLink
                className={({isActive}) =>
                  `${styles.item} ${isActive ? styles["item-active"] : ""}`
                }
                onClick={menu.close}
                role="menuitem"
                to="/profile"
              >
                <ProfileIcon />
                <span>{t("shell.profile")}</span>
              </NavLink>
              <button
                className={styles.item}
                onClick={() => {
                  menu.close();
                  onSignOut();
                }}
                role="menuitem"
                type="button"
              >
                <SignOutIcon />
                <span>{t("shell.signOut")}</span>
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 15 15" width="15">
      <circle cx="7.5" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.8 12.2c.7-2.1 2.3-3.2 4.7-3.2s4 1.1 4.7 3.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 15 15" width="15">
      <path
        d="M6.2 2.6H3.8A1.2 1.2 0 0 0 2.6 3.8v7.4a1.2 1.2 0 0 0 1.2 1.2h2.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
      <path
        d="M6.5 7.5h5.7M9.8 5.1 12.4 7.5 9.8 9.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.3"
      />
    </svg>
  );
}
