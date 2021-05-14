import * as React from "react";
import { useState } from "react";
import graphql from "babel-plugin-relay/macro";
import {
  loadQuery,
  RelayEnvironmentProvider,
  usePreloadedQuery,
  useQueryLoader,
  PreloadedQuery,
} from "react-relay/hooks";
import ComposerSummary from "./ComposerSummary";
import { AppInitialQuery } from "__relay__/AppInitialQuery.graphql";
import { AppComposersQuery } from "__relay__/AppComposersQuery.graphql";
import { IEnvironment } from "relay-runtime";

type CountriesEnum = AppInitialQuery["variables"]["country"];
type WorkKindEnum = AppInitialQuery["variables"]["workKind"];

export const InitialQuery = graphql`
  query AppInitialQuery($country: Country, $workKind: WorkKind) {
    countries: __type(name: "Country") {
      enumValues {
        name
      }
    }
    workKinds: __type(name: "WorkKind") {
      enumValues {
        name
      }
    }
    composers(country: $country) {
      id
      ...ComposerSummary_composer @arguments(workKind: $workKind)
    }
  }
`;

const ComposersQuery = graphql`
  query AppComposersQuery($country: Country, $workKind: WorkKind) {
    composers(country: $country) {
      id
      ...ComposerSummary_composer @arguments(workKind: $workKind)
    }
  }
`;

function ComposersListWrapper(props: { queryRef: PreloadedQuery<AppComposersQuery> }) {
  const data = usePreloadedQuery(ComposersQuery, props.queryRef);
  return <ComposersList composers={data.composers} />;
}

function ComposersList({
  composers,
}: {
  composers: AppComposersQuery["response"]["composers"];
}) {
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

function App(props: { initialQueryRef: PreloadedQuery<AppInitialQuery> }) {
  const [state, setState] = useState({
    country: props.initialQueryRef.variables.country,
    workKind: props.initialQueryRef.variables.workKind,
  });
  const data = usePreloadedQuery(InitialQuery, props.initialQueryRef);
  const [composersQueryRef, reloadComposersQuery] =
    useQueryLoader<AppComposersQuery>(ComposersQuery);

  const { countries, workKinds, composers } = data;

  return (
    <div>
      {countries?.enumValues && (
        <select
          value={state.country || undefined}
          onChange={(evt) => {
            let nextCountry = (evt.target.value || undefined) as CountriesEnum;
            let nextState = { ...state, country: nextCountry };
            setState(nextState);
            reloadComposersQuery(nextState);
          }}
          test-id="App-country-selector"
        >
          <option value={undefined}></option>
          {countries.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      )}

      {workKinds?.enumValues && (
        <select
          value={state.workKind || undefined}
          onChange={(evt) => {
            let nextWorkKind = (evt.target.value || undefined) as WorkKindEnum;
            let nextState = { ...state, workKind: nextWorkKind };
            setState(nextState);
            reloadComposersQuery(nextState);
          }}
          test-id="App-workKind-selector"
        >
          <option value={undefined}></option>
          {workKinds.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      )}

      {composersQueryRef ? (
        <React.Suspense fallback={"Loading..."}>
          <ComposersListWrapper queryRef={composersQueryRef} />
        </React.Suspense>
      ) : (
        <ComposersList composers={composers} />
      )}
    </div>
  );
}

export function Root({ env }: { env: IEnvironment }) {
  const initialQueryRef = loadQuery<AppInitialQuery>(env, InitialQuery, {
    country: null,
    workKind: null,
  });
  return (
    <RelayEnvironmentProvider environment={env}>
      <React.Suspense fallback={"Loading..."}>
        <App initialQueryRef={initialQueryRef} />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}
