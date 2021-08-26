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
import { AppSelectorsQuery } from "__relay__/AppSelectorsQuery.graphql";

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
  }
`;

function ComposersList(props: { preloadedQuery: PreloadedQuery<AppComposersQuery> }) {
  const { composers } = usePreloadedQuery(ComposersQuery, props.preloadedQuery);
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

export function App(props: {
  selectorsPreloadedQuery: PreloadedQuery<AppSelectorsQuery>;
  composersInitialPreloadedQuery: PreloadedQuery<AppComposersQuery>;
}) {
  // don't like typing of `composersQueryRef`: it cannot be null (???)
  // because of non-null `props.initialComposersQueryRef`.
  const [composersQueryRef, reloadComposersQuery] = useQueryLoader(
    ComposersQuery,
    props.composersInitialPreloadedQuery
  );

  const enums = usePreloadedQuery(SelectorsQuery, props.selectorsPreloadedQuery);
  /*
    __type.enumValues is typed as string array. If introspection query is
    done correctly all these values are in fact of Country type. There is no need to
    do decoding in runtime - more appropriate is to write single unit test.
    And to please Typescript it's ok to do type casting.
  */
  const selectors = {
    country: (enums.country?.enumValues || []).map((v) => v.name) as Country[],
    workKind: (enums.workKind?.enumValues || []).map((v) => v.name) as WorkKind[],
  };

  const [activeSelectors, setActiveSelectors] = useState(() => {
    const vs = props.composersInitialPreloadedQuery.variables;
    return {
      country: vs.country || undefined,
      workKind: vs.workKind || undefined,
    };
  });

  function selectorElement(name: keyof AppSelectorsQuery["response"]) {
    if (selectors[name].length > 0) {
      return (
        <select
          value={activeSelectors[name] || undefined}
          onChange={(evt) => {
            let value = decode[name](evt.target.value);
            let nextActiveSelectors = { ...activeSelectors, [name]: value };
            setActiveSelectors(nextActiveSelectors);
            reloadComposersQuery(nextActiveSelectors);
          }}
          test-id={`App-${name}-selector`}
        >
          <option value={undefined}></option>
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

      {composersQueryRef && (
        <div>
          <React.Suspense fallback={"Loading..."}>
            <ComposersList preloadedQuery={composersQueryRef} />
          </React.Suspense>
        </div>
      )}
    </div>
  );
}

export function createRootComponent({ relayEnv }: { relayEnv: IEnvironment }) {
  const selectorsPreloadedQuery = loadQuery<AppSelectorsQuery>(
    relayEnv,
    SelectorsQuery,
    {}
  );
  const composersInitialPreloadedQuery = loadQuery<AppComposersQuery>(
    relayEnv,
    ComposersQuery,
    {}
  );
  return function Root() {
    return (
      <RelayEnvironmentProvider environment={relayEnv}>
        <React.Suspense fallback={"Loading..."}>
          <App
            selectorsPreloadedQuery={selectorsPreloadedQuery}
            composersInitialPreloadedQuery={composersInitialPreloadedQuery}
          />
        </React.Suspense>
      </RelayEnvironmentProvider>
    );
  };
}
