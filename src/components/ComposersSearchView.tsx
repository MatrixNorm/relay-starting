import * as React from "react";
import { useState } from "react";
import graphql from "babel-plugin-relay/macro";
import { usePreloadedQuery, useQueryLoader } from "react-relay/hooks";
import ComposerSummary from "../components/ComposerSummary";
// types
import { PreloadedQuery } from "react-relay/hooks";
import { ComposersSearchViewInitialQuery as $InitialQuery } from "__relay__/ComposersSearchViewInitialQuery.graphql";
import { ComposersSearchViewComposersQuery as $ComposersQuery } from "__relay__/ComposersSearchViewComposersQuery.graphql";

function isNully(value: any) {
  return value === null || value === undefined;
}

function removeUndefinedValues(ob: Object) {
  let pairs = Object.entries(ob).filter((pair) => pair[1] !== undefined);
  return Object.fromEntries(pairs);
}

export const InitialQuery = graphql`
  query ComposersSearchViewInitialQuery($country: Country, $workKind: WorkKind) {
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
  query ComposersSearchViewComposersQuery($country: Country, $workKind: WorkKind) {
    composers(country: $country) {
      id
      ...ComposerSummary_composer @arguments(workKind: $workKind)
    }
  }
`;

type $Vars = $ComposersQuery["variables"];

export function ComposersSearchView(props: {
  initialQueryRef: PreloadedQuery<$InitialQuery>;
}) {
  const [state, setState] = useState<{
    // null or undefined means value is not set
    current: $Vars;
    // undefined means value is not set
    // null means value is unset
    draftDelta: $Vars;
  }>({
    current: {
      country: props.initialQueryRef.variables.country,
      workKind: props.initialQueryRef.variables.workKind,
    },
    draftDelta: {},
  });

  const data = usePreloadedQuery(InitialQuery, props.initialQueryRef);

  const [composersQueryRef, reloadComposersQuery] =
    useQueryLoader<$ComposersQuery>(ComposersQuery);

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
    (param: keyof $Vars) => (evt: React.ChangeEvent<HTMLSelectElement>) => {
      // This is de-facto decoding from external display representation
      // to internal one. Specifically empty string is decoded into undefined.
      const nextValue = evt.target.value || undefined;
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

  function calcSelectValue(param: keyof $Vars) {
    // This is de-facto encoding from internal representation to external display
    // one. Specifically undefined value is encoded as empty string.
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

  const makeSelect = (param: keyof $Vars) => {
    if ((data as any)[`${param}Values`]?.enumValues) {
      return (
        <select
          value={calcSelectValue(param)}
          onChange={onChange(param)}
          test-id={`App-${param}-selector`}
        >
          <option value="">---</option>
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

  return (
    <React.Suspense fallback={"Loading..."}>
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
    </React.Suspense>
  );
}

function ComposersListWrapper(props: { queryRef: PreloadedQuery<$ComposersQuery> }) {
  const data = usePreloadedQuery(ComposersQuery, props.queryRef);
  return <ComposersList composers={data.composers} />;
}

function ComposersList({
  composers,
}: {
  composers: $ComposersQuery["response"]["composers"];
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
