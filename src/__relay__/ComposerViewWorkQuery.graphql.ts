/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type WorkKind = "BALLET_SUITE" | "OPERA" | "PIANO_CONCERTO" | "PIANO_ETUDE" | "PIANO_PRELUDE" | "PIANO_SONATA" | "STRING_QUARTET" | "SYMTHONY" | "%future added value";
export type ComposerViewWorkQueryVariables = {
    workId: string;
};
export type ComposerViewWorkQueryResponse = {
    readonly workById: {
        readonly id: string;
        readonly name: string;
        readonly kind: WorkKind | null;
        readonly yearOfPublication: number | null;
        readonly description: string | null;
    } | null;
};
export type ComposerViewWorkQuery = {
    readonly response: ComposerViewWorkQueryResponse;
    readonly variables: ComposerViewWorkQueryVariables;
};



/*
query ComposerViewWorkQuery(
  $workId: ID!
) {
  workById(workId: $workId) {
    id
    name
    kind
    yearOfPublication
    description
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "workId",
        "variableName": "workId"
      }
    ],
    "concreteType": "Work",
    "kind": "LinkedField",
    "name": "workById",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
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
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
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
    "name": "ComposerViewWorkQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ComposerViewWorkQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d40c84e5c11cf9a6178e9756486d74af",
    "id": null,
    "metadata": {},
    "name": "ComposerViewWorkQuery",
    "operationKind": "query",
    "text": "query ComposerViewWorkQuery(\n  $workId: ID!\n) {\n  workById(workId: $workId) {\n    id\n    name\n    kind\n    yearOfPublication\n    description\n  }\n}\n"
  }
};
})();
(node as any).hash = '51903a744f795e9506f10d7aaea17244';
export default node;
