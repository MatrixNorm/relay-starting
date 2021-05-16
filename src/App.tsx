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
    countryValues: __type(name: "Country") {
      enumValues {
        name
      }
    }
    workKindValues: __type(name: "WorkKind") {
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
  const [state, setState] = useState<{
    current: AppComposersQuery["variables"];
    draft: AppComposersQuery["variables"];
  }>({
    current: {
      country: props.initialQueryRef.variables.country,
      workKind: props.initialQueryRef.variables.workKind,
    },
    draft: {},
  });
  const data = usePreloadedQuery(InitialQuery, props.initialQueryRef);
  const [composersQueryRef, reloadComposersQuery] =
    useQueryLoader<AppComposersQuery>(ComposersQuery);

  const { countryValues, workKindValues, composers } = data;

  function handleApply() {
    const nextState = {
      current: { ...state.current, ...state.draft },
      draft: {},
    };
    setState(nextState);
    reloadComposersQuery(nextState.current);
  }
  function handleCancel() {
    setState((prev) => {
      prev.draft = {};
      return prev;
    });
  }

  const onChange =
    (param: keyof AppComposersQuery["variables"]) =>
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      let nextValue = evt.target.value || undefined;
      if (nextValue !== state.current[param]) {
        setState((prev) => {
          let next = { ...prev };
          //@ts-ignore
          next.draft[param] = nextValue;
          return next;
        });
      } else {
        setState((prev) => {
          let next = { ...prev };
          delete next.draft[param];
          return next;
        });
      }
    };

  const makeSelect = (param: keyof AppComposersQuery["variables"]) => (
    <select
      value={state.current[param] || undefined}
      onChange={onChange(param)}
      test-id={`App-${param}-selector`}
    >
      <option value={undefined}></option>
      {countries.enumValues.map((value, j) => (
        <option value={value.name} key={j}>
          {value.name}
        </option>
      ))}
    </select>
  );
  console.log(state);
  return (
    <div>
      {countryValues?.enumValues && (
        <select
          value={state.current.country || undefined}
          onChange={onChange("country")}
          test-id="App-country-selector"
        >
          <option value={undefined}></option>
          {countryValues.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      )}
      {workKindValues?.enumValues && (
        <select
          value={state.current.workKind || undefined}
          onChange={onChange("workKind")}
          test-id="App-workKind-selector"
        >
          <option value={undefined}></option>
          {workKindValues.enumValues.map((value, j) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      )}

      {Object.keys(state.draft).length > 0 && (
        <div>
          <button onClick={handleApply}>apply</button>
          <button onClick={handleCancel}>cancel</button>
        </div>
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
