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
import { AppComposersQuery } from "__relay__/AppComposersQuery.graphql";
import { AppCountriesQuery } from "__relay__/AppCountriesQuery.graphql";

type CountriesEnum = AppComposersQuery["variables"]["country"];

const relayEnv = createMockedRelayEnvironment();

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
  const data = usePreloadedQuery(ComposersQuery, props.queryRef);
  const { composers } = data;
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

function CountrySelector(props: {
  countriesQueryRef: PreloadedQuery<AppCountriesQuery>;
  initialComposersQueryRef: PreloadedQuery<AppComposersQuery>;
}) {
  const [composersQueryRef, reloadComposersQuery] = useQueryLoader(
    ComposersQuery,
    props.initialComposersQueryRef
  );
  const data = usePreloadedQuery(CountriesQuery, props.countriesQueryRef);

  const { __type } = data;

  return (
    <div>
      {__type?.enumValues && (
        <select
          defaultValue={props.initialComposersQueryRef.variables.country || undefined}
          onChange={(evt) => {
            reloadComposersQuery({
              country: (evt.target.value || undefined) as CountriesEnum,
            });
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

const countriesQueryRef = loadQuery<AppCountriesQuery>(relayEnv, CountriesQuery, {});
const initialComposersQueryRef = loadQuery<AppComposersQuery>(relayEnv, ComposersQuery, {
  country: "Russia",
});

function Root() {
  return (
    <RelayEnvironmentProvider environment={relayEnv}>
      <React.Suspense fallback={"Loading..."}>
        <CountrySelector
          countriesQueryRef={countriesQueryRef}
          initialComposersQueryRef={initialComposersQueryRef}
        />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("app"));
