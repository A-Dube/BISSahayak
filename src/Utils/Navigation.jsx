import { useNavigate } from "react-router-dom";

export function useSidebarNav() {
  const navigate = useNavigate();

  const handleNavigation = (key) => {
    switch (key) {
      case "home":
        navigate("/home");
        break;

      case "assistant":
        navigate("/assistant");
        break;

      case "standards":
        navigate("/standards");
        break;

      case "certification":
        navigate("/certification");
        break;

      case "labs":
        navigate("/labs");
        break;

      case "hallmarking":
        navigate("/hallmarking");
        break;

      case "huid":
        navigate("/huid-verification");
        break;

      case "license":
        navigate("/license-verification");
        break;

      case "profile":
        navigate("/profile");
        break;

      case "help":
        navigate("/help");
        break;

      default:
        console.warn(`Unknown navigation key: ${key}`);
    }
  };

  return handleNavigation;
}