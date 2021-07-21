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

/**
 * !!! PROBLEM !!!
 * Possible mismatch between fragment declaration and
 * imported types. It's easy to import wrong file.
 *
 */

export default function ComposerSummary(props: {
  composer: ComposerSummary_composer$key;
}) {
  /**
   * In runtime `composer` is an object with shape
   * { id, __fragmentOwner, __fragments, __id }.
   * It has no actual data and has only "recipe" to extract
   * data from the Relay store.
   */
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
    <>
      {works ? (
        <ul>
          {works.map((work) => (
            <li key={work.id}>
              <span>{work.name}</span>
              <span> {work.type}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>This composer is a lazy bummer</div>
      )}
    </>
  );
}
