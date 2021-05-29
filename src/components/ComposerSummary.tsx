import * as React from "react";
import { useFragment } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import {
  ComposerSummary_composer,
  ComposerSummary_composer$key,
} from "__relay__/ComposerSummary_composer.graphql";

const fragmentRef = graphql`
  fragment ComposerSummary_composer on Composer
  @argumentDefinitions(workKind: { type: "WorkKind" }) {
    id
    name
    works(kind: $workKind) {
      id
      name
      kind
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
      <h4>
        <Link to={`/composer/${data.id}`}>{data.name}</Link>
      </h4>
      <WorkList works={data.works} composerId={data.id} />
    </div>
  );
}

function WorkList({
  works,
  composerId,
}: {
  works: ComposerSummary_composer["works"];
  composerId: string;
}) {
  return (
    <>
      {works ? (
        <ul>
          {works.map((work) => (
            <li key={work.id}>
              <Link to={`/composer/${composerId}/work/${work.id}`}>{work.name}</Link>
              <span> {work.kind}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>This composer is a lazy bummer</div>
      )}
    </>
  );
}
