/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type Country = "Austria" | "France" | "Germany" | "Italy" | "Poland" | "Russia" | "%future added value";
export type WorkKind = "BALLET_SUITE" | "OPERA" | "PIANO_CONCERTO" | "PIANO_ETUDE" | "PIANO_PRELUDE" | "PIANO_SONATA" | "STRING_QUARTET" | "SYMPHONY" | "%future added value";
export type ComposerDetailedViewQueryVariables = {
    composerId: string;
};
export type ComposerDetailedViewQueryResponse = {
    readonly composerById: {
        readonly id: string;
        readonly name: string;
        readonly country: Country | null;
        readonly works: ReadonlyArray<{
            readonly id: string;
            readonly name: string;
            readonly kind: WorkKind | null;
            readonly yearOfPublication: number | null;
        }> | null;
    } | null;
};
export type ComposerDetailedViewQuery = {
    readonly response: ComposerDetailedViewQueryResponse;
    readonly variables: ComposerDetailedViewQueryVariables;
};



/*
query ComposerDetailedViewQuery(
  $composerId: ID!
) {
  composerById(composerId: $composerId) {
    id
    name
    country
    works {
      id
      name
      kind
      yearOfPublication
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "composerId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "composerId",
        "variableName": "composerId"
      }
    ],
    "concreteType": "Composer",
    "kind": "LinkedField",
    "name": "composerById",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "country",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Work",
        "kind": "LinkedField",
        "name": "works",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ComposerDetailedViewQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ComposerDetailedViewQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "65c2241cfb85895f49f2fd57e8ea9da3",
    "id": null,
    "metadata": {},
    "name": "ComposerDetailedViewQuery",
    "operationKind": "query",
    "text": "query ComposerDetailedViewQuery(\n  $composerId: ID!\n) {\n  composerById(composerId: $composerId) {\n    id\n    name\n    country\n    works {\n      id\n      name\n      kind\n      yearOfPublication\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '7ea35f1362185e3618e08956e869c8cb';
export default node;
