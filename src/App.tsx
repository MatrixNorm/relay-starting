import * as React from "react";
import { useState } from "react";
import graphql from "babel-plugin-relay/macro";
import { usePreloadedQuery, useQueryLoader, PreloadedQuery } from "react-relay/hooks";
import ComposerSummary from "./ComposerSummary";
// types
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
function decodeCountry(externalValue: string): Country | undefined {
  return (externalValue as Country) || undefined;
}

function decodeWorkKind(externalValue: string): WorkKind | undefined {
  return (externalValue as WorkKind) || undefined;
}

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
  const [state, setState] = useState(() => {
    const vs = props.composersInitialPreloadedQuery.variables;
    return {
      country: vs.country || undefined,
      workKind: vs.workKind || undefined,
    };
  });
  // I don't like typing of `composersQueryRef`: it cannot be null (???)
  //   because of non-null `props.initialComposersQueryRef`.
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
  const countries = (enums.countries?.enumValues || []).map((v) => v.name) as Country[];
  const workKinds = (enums.workKinds?.enumValues || []).map((v) => v.name) as WorkKind[];

  return (
    <div>
      {countries.length > 0 ? (
        <select
          value={state.country || undefined}
          onChange={(evt) => {
            let country = decodeCountry(evt.target.value);
            let nextState = { ...state, country };
            setState(nextState);
            reloadComposersQuery(nextState);
          }}
          test-id="App-country-selector"
        >
          <option value={undefined}></option>
          {countries.map((name, j) => (
            <option value={name} key={j}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <select disabled></select>
      )}

      {workKinds.length > 0 ? (
        <select
          value={state.workKind || undefined}
          onChange={(evt) => {
            let workKind = decodeWorkKind(evt.target.value);
            let nextState = { ...state, workKind };
            setState(nextState);
            reloadComposersQuery(nextState);
          }}
          test-id="App-workKind-selector"
        >
          <option value={undefined}></option>
          {workKinds.map((name, j) => (
            <option value={name} key={j}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <select disabled></select>
      )}

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
