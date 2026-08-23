import {useEffect, useState, Suspense} from "react";
import {NavLink, Outlet, useLocation, useNavigate} from "react-router-dom";

import {isImmersiveShell, shellNav} from "@/app/shell-nav";
import {ShellAccessibilityControl} from "@/app/ShellAccessibilityControl";
import {ShellLanguageSelect} from "@/app/ShellLanguageSelect";
import {ShellUserMenu} from "@/app/ShellUserMenu";
import {useMediaQuery} from "@/app/useMediaQuery";
import {useSidebarCollapsed} from "@/app/useSidebarCollapsed";
import {useAuth} from "@/features/auth/AuthProvider";
import {useI18n} from "@/shared/preferences/PreferencesProvider";
import {BrandMark} from "@/shared/ui/actions/BrandMark";
import {DomainIcon} from "@/shared/ui/actions/DomainIcon";
import {CloseIcon} from "@/shared/ui/actions/action-icons";
import {OutletRouteSkeleton} from "@/shared/ui/feedback/OutletRouteSkeleton";
import {useToast} from "@/shared/ui/feedback/ToastProvider";
import {Tooltip} from "@/shared/ui/overlays/Tooltip";

import styles from "./AppShell.module.scss";

export function AppShell() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const immersive = isImmersiveShell(pathname);
  const isNarrow = useMediaQuery("(max-width: 56rem)");
  const {collapsed, toggleCollapsed} = useSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {user, signOut} = useAuth();
  const toast = useToast();
  const {t} = useI18n();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, isNarrow]);

  const onSignOut = () => {
    signOut();
    toast.info(t("shell.signedOut"));
    navigate("/login", {replace: true});
  };

  const sidebarCollapsed = !isNarrow && collapsed;
  const collapseLabel = collapsed ? t("shell.expand") : t("shell.collapse");

  return (
    <div
      className={[
        styles.layout,
        immersive ? styles["layout-immersive"] : "",
        sidebarCollapsed ? styles["layout-collapsed"] : "",
        isNarrow ? styles["layout-narrow"] : "",
        isNarrow && mobileOpen ? styles["layout-mobile-open"] : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isNarrow && mobileOpen ? (
        <button
          aria-label={t("shell.closeNav")}
          className={styles.backdrop}
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}

      <aside className={styles.sidebar} id="horizon-shell-sidebar">
        <div className={styles["sidebar-top"]}>
          <div className={styles.brand}>
            <span className={styles["brand-mark"]} aria-hidden="true">
              <BrandMark />
            </span>
            <p className={styles["brand-name"]}>Horizon</p>
          </div>
          {isNarrow ? (
            <button
              aria-label={t("shell.closeNav")}
              className={styles["collapse-button"]}
              onClick={() => setMobileOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>
          ) : (
            <Tooltip content={collapseLabel} position="right">
              <button
                aria-label={collapseLabel}
                className={styles["collapse-button"]}
                onClick={toggleCollapsed}
                type="button"
              >
                <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                  {collapsed ? (
                    <path
                      d="M6 3.5 10.5 8 6 12.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <path
                      d="M10 3.5 5.5 8 10 12.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </button>
            </Tooltip>
          )}
        </div>
        <nav aria-label={t("common.primaryNav")} className={styles.nav}>
          {shellNav.map((item) => {
            const label = t(item.labelKey);
            return (
              <Tooltip content={label} disabled={!sidebarCollapsed} key={item.to} position="right">
                <span className={styles["nav-tooltip"]}>
                  <NavLink
                    className={({isActive}) =>
                      `${styles.link} ${isActive ? styles["link-active"] : ""}`
                    }
                    end={item.to === "/map"}
                    to={item.to}
                  >
                    <span className={styles["link-icon"]}>
                      <DomainIcon name={item.icon} />
                    </span>
                    <span className={styles["link-label"]}>{label}</span>
                  </NavLink>
                </span>
              </Tooltip>
            );
          })}
        </nav>
        <div className={styles["sidebar-footer"]}>
          <ShellAccessibilityControl collapsed={sidebarCollapsed} />
          <ShellLanguageSelect collapsed={sidebarCollapsed} />
          {user ? (
            <ShellUserMenu collapsed={sidebarCollapsed} onSignOut={onSignOut} user={user} />
          ) : null}
        </div>
      </aside>

      {isNarrow ? (
        <button
          aria-controls="horizon-shell-sidebar"
          aria-expanded={mobileOpen}
          aria-label={t("shell.openNav")}
          className={styles["mobile-menu-button"]}
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
            <path
              d="M3 5h12M3 9h12M3 13h12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      ) : null}

      <main className={styles.main}>
        <Suspense fallback={<OutletRouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
