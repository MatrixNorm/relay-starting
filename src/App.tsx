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
import { AppRootQuery, Country } from "__relay__/AppRootQuery.graphql";

/*
  XXX need some generic decode/encode library
*/
function decodeCountry(externalValue: string): Country | undefined {
  return (externalValue as Country) || undefined;
}

function encodeCountry(country: Country | null | undefined): string | undefined {
  return country || undefined;
}

function ComposerList(props: {
  queryRef: PreloadedQuery<AppRootQuery>;
  reloadQuery: (variables: AppRootQuery["variables"]) => void;
}) {
  const { composers, __type } = usePreloadedQuery(appQuery, props.queryRef);

  return (
    <div>
      {__type?.enumValues ? (
        <select
          defaultValue={encodeCountry(props.queryRef.variables.country)}
          onChange={(evt) => {
            props.reloadQuery({ country: decodeCountry(evt.target.value) });
          }}
        >
          <option value={undefined}></option>
          {__type.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      ) : (
        <select>
          <option value={undefined}></option>
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
  /*
    reloadQuery calls loadQuery with new query params.
    queryRef is either the result of this call or initialQueryRef.
  */
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

/*
  Eagerly makes request to data API.
  Must be done outside of render. (XXX: why?)
*/
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
 *    Right thing to do is to load options on first render and
 *    subsequently reload only list of composers. This can be
 *    achieved by more clever use of suspense boundaries.
 */
