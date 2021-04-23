import { graphql, useFragment } from "react-relay";

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

export function ComposerSummary(props) {
  const data = useFragment(fragmentRef, props.composer);
  return (
    <div>
      <h4>{data.name}</h4>
      <WorkList works={data.works} />
    </div>
  );
}

function WorkList({ works }) {
  return (
    <ul>
      {works.map((work) => (
        <li key={work.id}>{work.name}</li>
      ))}
    </ul>
  );
}
