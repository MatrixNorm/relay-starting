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

function isNully(value: any) {
  return value === null || value === undefined;
}

function removeUndefinedValues(ob: Object) {
  let pairs = Object.entries(ob).filter((pair) => pair[1] !== undefined);
  return Object.fromEntries(pairs);
}

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
    // null or undefined means value is not set
    current: AppComposersQuery["variables"];
    // undefined means value is not set
    // null means value is unset
    draftDelta: AppComposersQuery["variables"];
  }>({
    current: {
      country: props.initialQueryRef.variables.country,
      workKind: props.initialQueryRef.variables.workKind,
    },
    draftDelta: {},
  });
  const data = usePreloadedQuery(InitialQuery, props.initialQueryRef);
  const [composersQueryRef, reloadComposersQuery] =
    useQueryLoader<AppComposersQuery>(ComposersQuery);

  function handleApply() {
    const nextState = {
      current: { ...state.current, ...removeUndefinedValues(state.draftDelta) },
      draftDelta: {},
    };
    setState(nextState);
    reloadComposersQuery(nextState.current);
  }
  function handleCancel() {
    setState((prev) => {
      const next = { ...prev };
      next.draftDelta = {};
      return next;
    });
  }

  const onChange =
    (param: keyof AppComposersQuery["variables"]) =>
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const nextValue = evt.target.value || undefined;
      console.log({ nextValue });
      const currentValue = state.current[param];
      if (isNully(nextValue)) {
        if (isNully(currentValue)) {
          setState((prev) => {
            let next = { ...prev };
            delete next.draftDelta[param];
            return next;
          });
        } else {
          setState((prev) => {
            let next = { ...prev };
            next.draftDelta[param] = null;
            return next;
          });
        }
      } else {
        if (nextValue !== currentValue) {
          setState((prev) => {
            let next = { ...prev };
            (next.draftDelta[param] as any) = nextValue;
            return next;
          });
        } else {
          setState((prev) => {
            let next = { ...prev };
            delete next.draftDelta[param];
            return next;
          });
        }
      }
    };

  function calcSelectValue(param: keyof AppComposersQuery["variables"]) {
    let draft = state.draftDelta[param];

    if (draft === null) {
      return "";
    }
    if (draft) {
      return draft;
    }
    return state.current[param] || "";
  }

  function shouldShowButtons() {
    return Object.keys(state.draftDelta).filter((x) => x !== undefined).length > 0;
  }

  const makeSelect = (param: keyof AppComposersQuery["variables"]) => {
    if ((data as any)[`${param}Values`]?.enumValues) {
      console.log(param, calcSelectValue(param));
      return (
        <select
          value={calcSelectValue(param)}
          onChange={onChange(param)}
          test-id={`App-${param}-selector`}
        >
          <option value={undefined}></option>
          {(data as any)[`${param}Values`].enumValues.map((value: any, j: number) => (
            <option value={value.name} key={j}>
              {value.name}
            </option>
          ))}
        </select>
      );
    }
    return null;
  };
  console.log(state);
  return (
    <div>
      {makeSelect("country")}
      {makeSelect("workKind")}

      {shouldShowButtons() && (
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
        <ComposersList composers={data.composers} />
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
