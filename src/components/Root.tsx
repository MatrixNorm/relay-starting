import * as React from "react";
import Link from "../routing/Link";
import styles from "./styles.css";
//types
import { ReactNode } from "react";

export default function Root(props: { children?: ReactNode }) {
  return (
    <div>
      <nav className={styles.navbar}>
        <Link to="/">Home</Link>
      </nav>
      {props.children}
    </div>
  );
}
