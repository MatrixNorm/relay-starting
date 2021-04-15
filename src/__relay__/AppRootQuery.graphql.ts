/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AppRootQueryVariables = {};
export type AppRootQueryResponse = {
    readonly composers: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
    }> | null;
};
export type AppRootQuery = {
    readonly response: AppRootQueryResponse;
    readonly variables: AppRootQueryVariables;
};



/*
query AppRootQuery {
  composers {
    id
    name
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Composer",
    "kind": "LinkedField",
    "name": "composers",
    "plural": true,
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppRootQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppRootQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "d9f3c3e90f1731c03a3a158346c65e60",
    "id": null,
    "metadata": {},
    "name": "AppRootQuery",
    "operationKind": "query",
    "text": "query AppRootQuery {\n  composers {\n    id\n    name\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd39734bf079930f13eb4f0879edcc067';
export default node;
