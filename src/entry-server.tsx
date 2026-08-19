import { renderToString } from "react-dom/server";
import App from "./App";
import { routes, type RouteDefinition } from "./routes";

export { routes };

export function render(route: RouteDefinition) {
  return renderToString(<App route={route} />);
}
