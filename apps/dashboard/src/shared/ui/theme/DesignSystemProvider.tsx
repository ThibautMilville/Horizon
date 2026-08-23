import {ThemeProvider} from "@mui/material/styles";
import {useMemo, type ReactNode} from "react";

import {usePreferences} from "@/shared/preferences/PreferencesProvider";
import {createDesignSystemTheme} from "@/shared/ui/theme/design-system-theme";

type DesignSystemProviderProps = {
  children: ReactNode;
};

export function DesignSystemProvider({children}: DesignSystemProviderProps) {
  const {theme} = usePreferences();
  const muiTheme = useMemo(() => createDesignSystemTheme(theme), [theme]);
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
