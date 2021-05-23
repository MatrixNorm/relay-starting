import * as React from "react";
import { Router } from "./createRouter";

const RoutingContext = React.createContext<Router>(null);

/**
 * A custom context instance for our router type
 */
export default RoutingContext;
