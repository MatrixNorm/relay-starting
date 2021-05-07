/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AppSelectorsQueryVariables = {};
export type AppSelectorsQueryResponse = {
    readonly countries: {
        readonly enumValues: ReadonlyArray<{
            readonly name: string;
        }> | null;
    } | null;
    readonly workKinds: {
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
    "alias": "countries",
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
    "alias": "workKinds",
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
    "cacheID": "d962e315cd4cd6013f62f119472ecf2a",
    "id": null,
    "metadata": {},
    "name": "AppSelectorsQuery",
    "operationKind": "query",
    "text": "query AppSelectorsQuery {\n  countries: __type(name: \"Country\") {\n    enumValues {\n      name\n    }\n  }\n  workKinds: __type(name: \"WorkKind\") {\n    enumValues {\n      name\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'a9f0d04b4280ed485c674efe2abbac12';
export default node;
