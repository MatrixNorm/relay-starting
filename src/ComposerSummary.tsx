import * as React from "react";
import { useFragment } from "react-relay";
import graphql from "babel-plugin-relay/macro";

import {
  ComposerSummary_composer,
  ComposerSummary_composer$key,
} from "__relay__/ComposerSummary_composer.graphql";

const fragmentRef = graphql`
  fragment ComposerSummary_composer on Composer {
    id
    name
    works {
      id
      name
      type
      yearOfPublication
    }
  }
`;

export default function ComposerSummary(props: {
  composer: ComposerSummary_composer$key;
}) {
  const data = useFragment(fragmentRef, props.composer);
  return (
    <div>
      <h4>{data.name}</h4>
      <WorkList works={data.works} />
    </div>
  );
}

function WorkList({ works }: { works: ComposerSummary_composer["works"] }) {
  return (
    <ul>
      {works.map((work) => (
        <li key={work.id}>
          <span>{work.name}</span>
          <span> {work.type}</span>
        </li>
      ))}
    </ul>
  );
}
