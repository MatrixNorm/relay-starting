/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AppSelectorsQueryVariables = {};
export type AppSelectorsQueryResponse = {
    readonly country: {
        readonly enumValues: ReadonlyArray<{
            readonly name: string;
        }> | null;
    } | null;
    readonly workKind: {
        readonly enumValues: ReadonlyArray<{
            readonly name: string;
        }> | null;
    } | null;
};
export type AppSelectorsQuery = {
    readonly response: AppSelectorsQueryResponse;
    readonly variables: AppSelectorsQueryVariables;
};



/*
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = [
  {
    "alias": "country",
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
    "selections": (v0/*: any*/),
    "storageKey": "__type(name:\"Country\")"
  },
  {
    "alias": "workKind",
    "args": [
      {
        "kind": "Literal",
        "name": "name",
        "value": "WorkKind"
      }
    ],
    "concreteType": "__Type",
    "kind": "LinkedField",
    "name": "__type",
    "plural": false,
    "selections": (v0/*: any*/),
    "storageKey": "__type(name:\"WorkKind\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppSelectorsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppSelectorsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "71164b242e052fc8abf7ed2e89cca9cc",
    "id": null,
    "metadata": {},
    "name": "AppSelectorsQuery",
    "operationKind": "query",
    "text": "query AppSelectorsQuery {\n  country: __type(name: \"Country\") {\n    enumValues {\n      name\n    }\n  }\n  workKind: __type(name: \"WorkKind\") {\n    enumValues {\n      name\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd1271a727b3ec29788e409ba9868bee1';
export default node;
