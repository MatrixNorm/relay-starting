import * as React from "react";
import Link from "../routing/Link";

export default function Root(props: { children: any }) {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/composers">Composers</Link>
      </nav>
      {props.children}
    </div>
  );
}
