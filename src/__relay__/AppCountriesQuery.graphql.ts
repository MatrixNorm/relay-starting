/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AppCountriesQueryVariables = {};
export type AppCountriesQueryResponse = {
    readonly __type: {
        readonly enumValues: ReadonlyArray<{
            readonly name: string;
        }> | null;
    } | null;
};
export type AppCountriesQuery = {
    readonly response: AppCountriesQueryResponse;
    readonly variables: AppCountriesQueryVariables;
};



/*
query AppCountriesQuery {
  __type(name: "Country") {
    enumValues {
      name
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "name",
        "value": "Country"
      }
    ],
    "concreteType": "__Type",
    "kind": "LinkedField",
    "name": "__type",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "__EnumValue",
        "kind": "LinkedField",
        "name": "enumValues",
        "plural": true,
        "selections": [
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
    ],
    "storageKey": "__type(name:\"Country\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppCountriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppCountriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "81c1f80ae58511d04ee930593ec90629",
    "id": null,
    "metadata": {},
    "name": "AppCountriesQuery",
    "operationKind": "query",
    "text": "query AppCountriesQuery {\n  __type(name: \"Country\") {\n    enumValues {\n      name\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '6a19fe8781bb00bcbad7380ab11ec01d';
export default node;
