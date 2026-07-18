"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const displayTheme = mounted ? theme : "system";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${displayTheme}. Click to switch.`}
      className="min-h-[44px] min-w-[44px]"
    >
      {displayTheme === "light" && <Sun className="h-5 w-5" />}
      {displayTheme === "dark" && <Moon className="h-5 w-5" />}
      {(displayTheme === "system" || !displayTheme) && <Monitor className="h-5 w-5" />}
    </Button>
  );
};
