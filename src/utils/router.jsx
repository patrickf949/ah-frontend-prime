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

export const RouteElement = ({ component: Component }) => {
  const router = useLegacyRouter();
  return <Component {...router} />;
};
