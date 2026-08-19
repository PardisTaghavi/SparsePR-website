import { renderToString } from "react-dom/server";
import App, { galleries } from "./App";
import { routes, type RouteDefinition } from "./routes";

export { galleries, routes };

export function render(route: RouteDefinition) {
  return renderToString(<App route={route} />);
}
