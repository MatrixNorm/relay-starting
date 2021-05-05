import * as React from "react";
import * as ReactDOM from "react-dom";
import graphql from "babel-plugin-relay/macro";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
  useQueryLoader,
  PreloadedQuery,
} from "react-relay/hooks";
import { createMockedRelayEnvironment } from "./env";
import ComposerSummary from "./ComposerSummary";
import { AppRootQuery } from "__relay__/AppRootQuery.graphql";

function ComposerList(props: {
  queryRef: PreloadedQuery<AppRootQuery>;
  reloadQuery: any;
}) {
  const data = usePreloadedQuery(appQuery, props.queryRef);
  const { composers, __type } = data;
  return (
    <div>
      {__type?.enumValues && (
        <select
          defaultValue={props.queryRef.variables.country || undefined}
          onChange={(evt) => {
            props.reloadQuery({ country: evt.target.value || undefined });
          }}
        >
          <option value={undefined}></option>
          {__type.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      )}
      {composers
        ? composers.map((composer) => (
            <ComposerSummary composer={composer} key={composer.id} />
          ))
        : "Nothing to show"}
    </div>
  );
}

function App(props: { initialQueryRef: PreloadedQuery<AppRootQuery> }) {
  const [queryRef, reloadQuery] = useQueryLoader(appQuery, props.initialQueryRef);
  return queryRef ? <ComposerList queryRef={queryRef} reloadQuery={reloadQuery} /> : null;
}

const relayEnv = createMockedRelayEnvironment();

const appQuery = graphql`
  query AppRootQuery($country: Country) {
    __type(name: "Country") {
      enumValues {
        name
      }
    }
    composers(country: $country) {
      id
      ...ComposerSummary_composer
    }
  }
`;

const initialQueryRef = loadQuery<AppRootQuery>(relayEnv, appQuery, {
  country: "Russia",
});

function Root() {
  return (
    <RelayEnvironmentProvider environment={relayEnv}>
      <React.Suspense fallback={"Loading..."}>
        <App initialQueryRef={initialQueryRef} />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("app"));

/**
 * Problems:
 * 1. Select element is reloaded every time new option is chosen.
 *    Right thing is to load options on first render and subsequently
 *    reload only list of composers.
 */
