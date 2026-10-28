import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useLegacyRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return {
    history: {
      push: to => navigate(to),
      replace: to => navigate(to, { replace: true }),
      go: delta => navigate(delta),
      back: () => navigate(-1),
      forward: () => navigate(1)
    },
    location,
    match: { params }
  };
};

export const withRouter = Component => {
  const ComponentWithRouter = props => {
    const router = useLegacyRouter();
    return <Component {...props} {...router} />;
  };

  ComponentWithRouter.displayName = `withRouter(${
    Component.displayName || Component.name || "Component"
  })`;

  return ComponentWithRouter;
};

const getPageTitle = (pathname) => {
  if (pathname === "/" || pathname === "/home") return "Authors Haven";
  if (pathname === "/about") return "About | Authors Haven";
  if (pathname === "/login") return "Login | Authors Haven";
  if (pathname === "/register") return "Register | Authors Haven";
  if (pathname === "/create-article") return "New Story | Authors Haven";
  if (pathname.startsWith("/edit-article/")) return "Edit Story | Authors Haven";
  if (pathname === "/user-articles") return "My Stories | Authors Haven";
  if (pathname === "/favorites") return "Favorites | Authors Haven";
  if (pathname === "/editprofile") return "Edit Profile | Authors Haven";
  if (pathname.startsWith("/profile/")) return "Profile | Authors Haven";
  if (pathname === "/passwordresetemail" || pathname.includes("/passwordreset")) {
    return "Reset Password | Authors Haven";
  }
  // For article view (/article/:slug), title is handled dynamically by applyArticleSeo
  if (pathname.startsWith("/article/")) return null;
  return "Authors Haven";
};

export const RouteElement = ({ component: Component }) => {
  const router = useLegacyRouter();
  const title = getPageTitle(router.location?.pathname || "");
  if (title) {
    document.title = title;
  }
  return <Component {...router} />;
};
