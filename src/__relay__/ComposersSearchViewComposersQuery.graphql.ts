/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Country = "Austria" | "France" | "Germany" | "Italy" | "Poland" | "Russia" | "%future added value";
export type WorkKind = "BALLET_SUITE" | "OPERA" | "PIANO_CONCERTO" | "PIANO_ETUDE" | "PIANO_PRELUDE" | "PIANO_SONATA" | "STRING_QUARTET" | "SYMTHONY" | "%future added value";
export type ComposersSearchViewComposersQueryVariables = {
    country?: Country | null;
    workKind?: WorkKind | null;
};
export type ComposersSearchViewComposersQueryResponse = {
    readonly composers: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ComposerSummary_composer">;
    }> | null;
};
export type ComposersSearchViewComposersQuery = {
    readonly response: ComposersSearchViewComposersQueryResponse;
    readonly variables: ComposersSearchViewComposersQueryVariables;
};



/*
query ComposersSearchViewComposersQuery(
  $country: Country
  $workKind: WorkKind
) {
  composers(country: $country) {
    id
    ...ComposerSummary_composer_15hxLD
  }
}

fragment ComposerSummary_composer_15hxLD on Composer {
  id
  name
  works(kind: $workKind) {
    id
    name
    kind
    yearOfPublication
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "country"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workKind"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "country",
    "variableName": "country"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ComposersSearchViewComposersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Composer",
        "kind": "LinkedField",
        "name": "composers",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "args": [
              {
                "kind": "Variable",
                "name": "workKind",
                "variableName": "workKind"
              }
            ],
            "kind": "FragmentSpread",
            "name": "ComposerSummary_composer"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ComposersSearchViewComposersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Composer",
        "kind": "LinkedField",
        "name": "composers",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "kind",
                "variableName": "workKind"
              }
            ],
            "concreteType": "Work",
            "kind": "LinkedField",
            "name": "works",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "kind",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "yearOfPublication",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e55dcf51019548230d7eede2921b82b4",
    "id": null,
    "metadata": {},
    "name": "ComposersSearchViewComposersQuery",
    "operationKind": "query",
    "text": "query ComposersSearchViewComposersQuery(\n  $country: Country\n  $workKind: WorkKind\n) {\n  composers(country: $country) {\n    id\n    ...ComposerSummary_composer_15hxLD\n  }\n}\n\nfragment ComposerSummary_composer_15hxLD on Composer {\n  id\n  name\n  works(kind: $workKind) {\n    id\n    name\n    kind\n    yearOfPublication\n  }\n}\n"
  }
};
})();
(node as any).hash = '553b7952bca551368bf2498f875dbdda';
export default node;
