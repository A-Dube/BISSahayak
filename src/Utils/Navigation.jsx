import { useNavigate } from "react-router-dom";

export const NAV_PATHS = {
  home: "/home",
  assistant: "/assistant",
  standards: "/standards",
  certification: "/certification",
  labs: "/#",
  hallmarking: "/#",
  profile: "/#",
  help: "/#",
};

export function useSidebarNav() {
  const navigate = useNavigate();
  return (key) => {
    const path = NAV_PATHS[key];
    if (path) navigate(path);
  };
}