import * as React from "react";
import Link from "../routing/Link";
import styles from "./styles.css";

export default function Root(props: { children: any }) {
  return (
    <div>
      <nav className={styles.navbar}>
        <Link to="/">Home</Link>
      </nav>
      {props.children}
    </div>
  );
}
