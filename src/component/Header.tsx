import * as React from "react";
import Link from "../routing/Link";

export default function Header(props: { children?: any }) {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/composers">Composers</Link>
        <Link to="/wrong-url">404</Link>
      </nav>
      {props.children}
    </div>
  );
}
