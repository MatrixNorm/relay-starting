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
  Ideally single source of truth should be data specification
  like Clojure Spec. GraphQL schema and all types can be derived from it.

  `externalValue` comes from the user as a string and can be outside
  of Country type. It is easy to do validation via data spec.

  Say, we do not control GraphQL schema creation and thus do not have 
  data spec. It is possible to create tool that will generate validation
  code from GraphQL schema. It will be inherently weak compared to Clojure
  Spec but it will suffice for validation of enum types like Country.

*/
function decodeCountry(externalValue: string): Country | undefined {
  return (externalValue as Country) || undefined;
}

function ComposerList(props: {
  queryRef: PreloadedQuery<AppRootQuery>;
  reloadQuery: (variables: AppRootQuery["variables"]) => void;
}) {
  const { composers, __type } = usePreloadedQuery(appQuery, props.queryRef);

  /*
    __type.enumValues is typed as string array. If introspection query is
    done correctly all these values are in fact of Country type. There is no need to
    do decoding in runtime - more appropriate is to write single unit test.
    And to please Typescript it's ok to do type casting.
  */
  const countries = (__type?.enumValues || []).map((v) => v.name) as Country[];

  const initiallySelectedValue = props.queryRef.variables.country || undefined;

  return (
    <div>
      {countries.length > 0 ? (
        <select
          defaultValue={initiallySelectedValue}
          onChange={(evt) => {
            props.reloadQuery({ country: decodeCountry(evt.target.value) });
          }}
        >
          <option value={undefined}></option>
          {countries.map((countryName, j) => (
            <option value={countryName} key={j}>
              {countryName}
            </option>
          ))}
        </select>
      ) : (
        <select disabled></select>
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
    `reloadQuery` calls loadQuery again with new query params.
    `queryRef` is either the result of this call or is `initialQueryRef`
    on first render.
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
