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
import { AppComposersQuery } from "__relay__/AppComposersQuery.graphql";
import { AppSelectorsQuery } from "__relay__/AppSelectorsQuery.graphql";
import { IEnvironment } from "relay-runtime";

type CountriesEnum = AppComposersQuery["variables"]["country"];
type WorkKindEnum = AppComposersQuery["variables"]["workKind"];

export const ComposersQuery = graphql`
  query AppComposersQuery($country: Country, $workKind: WorkKind) {
    composers(country: $country) {
      id
      ...ComposerSummary_composer @arguments(workKind: $workKind)
    }
  }
`;

export const SelectorsQuery = graphql`
  query AppSelectorsQuery {
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

function App(props: {
  selectorsQueryRef: PreloadedQuery<AppSelectorsQuery>;
  initialComposersQueryRef: PreloadedQuery<AppComposersQuery>;
}) {
  const [state, setState] = useState({
    country: props.initialComposersQueryRef.variables.country,
    workKind: props.initialComposersQueryRef.variables.workKind,
  });
  const [composersQueryRef, reloadComposersQuery] = useQueryLoader(
    ComposersQuery,
    props.initialComposersQueryRef
  );
  const data = usePreloadedQuery(SelectorsQuery, props.selectorsQueryRef);

  const { countries, workKinds } = data;

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
        <div>
          <React.Suspense fallback={"Loading..."}>
            <ComposersList queryRef={composersQueryRef} />
          </React.Suspense>
        </div>
      ) : null}
    </div>
  );
}

export function Root({ env }: { env: IEnvironment }) {
  const selectorsQueryRef = loadQuery<AppSelectorsQuery>(env, SelectorsQuery, {});
  const initialComposersQueryRef = loadQuery<AppComposersQuery>(env, ComposersQuery, {
    country: null,
    workKind: null,
  });
  return (
    <RelayEnvironmentProvider environment={env}>
      <React.Suspense fallback={"Loading..."}>
        <App
          selectorsQueryRef={selectorsQueryRef}
          initialComposersQueryRef={initialComposersQueryRef}
        />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}
