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
// types
import { IEnvironment } from "relay-runtime";
import {
  AppComposersQuery,
  Country,
  WorkKind,
} from "__relay__/AppComposersQuery.graphql";
import {
  AppInitialQuery,
  AppInitialQueryVariables,
} from "__relay__/AppInitialQuery.graphql";
import { Denull } from "./typeUtils";

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
const decode = {
  country(externalValue: string): Country | undefined {
    return (externalValue as Country) || undefined;
  },
  workKind(externalValue: string): WorkKind | undefined {
    return (externalValue as WorkKind) || undefined;
  },
};

const encode = (internalValue: Country | WorkKind | undefined): string => {
  return internalValue || "";
};

export const InitialQuery = graphql`
  query AppInitialQuery($country: Country, $workKind: WorkKind) {
    country: __type(name: "Country") {
      enumValues {
        name
      }
    }
    workKind: __type(name: "WorkKind") {
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

export const ComposersQuery = graphql`
  query AppComposersQuery($country: Country, $workKind: WorkKind) {
    composers(country: $country) {
      id
      ...ComposerSummary_composer @arguments(workKind: $workKind)
    }
  }
`;

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

function ComposersListWrapper(props: {
  preloadedQuery: PreloadedQuery<AppComposersQuery>;
}) {
  const data = usePreloadedQuery(ComposersQuery, props.preloadedQuery);
  return <ComposersList composers={data.composers} />;
}

export function App(props: { initialPreloadedQuery: PreloadedQuery<AppInitialQuery> }) {
  const [composersQueryRef, reloadComposersQuery] =
    useQueryLoader<AppComposersQuery>(ComposersQuery);

  const { composers, country, workKind } = usePreloadedQuery(
    InitialQuery,
    props.initialPreloadedQuery
  );
  /*
    __type.enumValues is typed as string array. If introspection query is
    done correctly all these values are in fact of Country type. There is no need to
    do decoding in runtime - more appropriate is to write single unit test.
    And to please Typescript it's ok to do type casting.
  */
  const selectors = {
    country: (country?.enumValues || []).map((v) => v.name) as Country[],
    workKind: (workKind?.enumValues || []).map((v) => v.name) as WorkKind[],
  };

  const __initFn = () => {
    const vs = props.initialPreloadedQuery.variables;
    return {
      country: vs.country || undefined,
      workKind: vs.workKind || undefined,
    };
  };

  const [appliedSelectors, setAppliedSelectors] =
    useState<Denull<AppInitialQueryVariables>>(__initFn);

  const [draftSelectors, setDraftSelectors] =
    useState<Denull<AppInitialQueryVariables>>(__initFn);

  function isDraftDiffers() {
    return JSON.stringify(appliedSelectors) !== JSON.stringify(draftSelectors);
  }

  function handleApply() {
    if (isDraftDiffers()) {
      setAppliedSelectors(draftSelectors);
      reloadComposersQuery(draftSelectors);
    }
  }

  function handleCancel() {
    if (isDraftDiffers()) {
      setDraftSelectors(appliedSelectors);
    }
  }

  function selectorElement(name: keyof AppInitialQueryVariables) {
    if (selectors[name].length > 0) {
      return (
        <select
          value={encode(draftSelectors[name])}
          onChange={(evt) => {
            let value = decode[name](evt.target.value);
            setDraftSelectors((prev) => ({ ...prev, [name]: value }));
          }}
          test-id={`App-${name}-selector`}
        >
          <option value=""></option>
          {selectors[name].map((name, j) => (
            <option value={name} key={j}>
              {name}
            </option>
          ))}
        </select>
      );
    } else {
      return <select disabled test-id={`App-${name}-selector`}></select>;
    }
  }

  return (
    <div>
      {selectorElement("country")}
      {selectorElement("workKind")}

      {isDraftDiffers() && (
        <div>
          <button onClick={handleApply}>apply</button>
          <button onClick={handleCancel}>cancel</button>
        </div>
      )}

      {composersQueryRef ? (
        <div>
          <React.Suspense fallback={"Loading..."}>
            <ComposersListWrapper preloadedQuery={composersQueryRef} />
          </React.Suspense>
        </div>
      ) : (
        <ComposersList composers={composers} />
      )}
    </div>
  );
}

export function createRootComponent({ relayEnv }: { relayEnv: IEnvironment }) {
  const initialPreloadedQuery = loadQuery<AppInitialQuery>(relayEnv, InitialQuery, {});
  return function Root() {
    return (
      <RelayEnvironmentProvider environment={relayEnv}>
        <React.Suspense fallback={"Loading..."}>
          <App initialPreloadedQuery={initialPreloadedQuery} />
        </React.Suspense>
      </RelayEnvironmentProvider>
    );
  };
}
