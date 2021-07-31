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
import { AppComposersQuery, Country } from "__relay__/AppComposersQuery.graphql";
import { AppCountriesQuery } from "__relay__/AppCountriesQuery.graphql";

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

const ComposersQuery = graphql`
  query AppComposersQuery($country: Country) {
    composers(country: $country) {
      id
      ...ComposerSummary_composer
    }
  }
`;

const CountriesQuery = graphql`
  query AppCountriesQuery {
    __type(name: "Country") {
      enumValues {
        name
      }
    }
  }
`;

function ComposersList(props: { queryRef: PreloadedQuery<AppComposersQuery> }) {
  const { composers } = usePreloadedQuery(ComposersQuery, props.queryRef);
  return (
    <div>
      {composers
        ? composers.map((composer) => (
            <ComposerSummary composer={composer} key={composer.id} />
          ))
        : "Nothing to show"}
    </div>
  );
}

function ComposersViewWithSelection(props: {
  countriesQueryRef: PreloadedQuery<AppCountriesQuery>;
  initialComposersQueryRef: PreloadedQuery<AppComposersQuery>;
}) {
  const [composersQueryRef, reloadComposersQuery] = useQueryLoader(
    ComposersQuery,
    props.initialComposersQueryRef
  );
  const { __type } = usePreloadedQuery(CountriesQuery, props.countriesQueryRef);
  /*
    __type.enumValues is typed as string array. If introspection query is
    done correctly all these values are in fact of Country type. There is no need to
    do decoding in runtime - more appropriate is to write single unit test.
    And to please Typescript it's ok to do type casting.
  */
  const countries = (__type?.enumValues || []).map((v) => v.name) as Country[];

  const initiallySelectedValue =
    props.initialComposersQueryRef.variables.country || undefined;

  return (
    <div>
      {countries.length > 0 ? (
        <select
          defaultValue={initiallySelectedValue}
          onChange={(evt) => {
            reloadComposersQuery({ country: decodeCountry(evt.target.value) });
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

      {/* XXX */}
      {composersQueryRef ? (
        <div>
          <React.Suspense fallback={"Loading..."}>
            <ComposersList queryRef={composersQueryRef} />
          </React.Suspense>
        </div>
      ) : null}
    </div>
  );
}

const relayEnv = createMockedRelayEnvironment();

const countriesQueryRef = loadQuery<AppCountriesQuery>(relayEnv, CountriesQuery, {});

const initialComposersQueryRef = loadQuery<AppComposersQuery>(relayEnv, ComposersQuery, {
  country: "Russia",
});

function Root() {
  return (
    <RelayEnvironmentProvider environment={relayEnv}>
      <React.Suspense fallback={"Loading..."}>
        <ComposersViewWithSelection
          countriesQueryRef={countriesQueryRef}
          initialComposersQueryRef={initialComposersQueryRef}
        />
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
