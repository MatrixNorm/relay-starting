/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AppRootQueryVariables = {};
export type AppRootQueryResponse = {
    readonly composers: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ComposerSummary_composer">;
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
    ...ComposerSummary_composer
  }
}

fragment ComposerSummary_composer on Composer {
  id
  name
  works {
    id
    name
    type
    yearOfPublication
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Composer",
        "kind": "LinkedField",
        "name": "composers",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppRootQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Composer",
        "kind": "LinkedField",
        "name": "composers",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Work",
            "kind": "LinkedField",
            "name": "works",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "type",
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
    "cacheID": "45be423370af837bcb4fc9c448180b59",
    "id": null,
    "metadata": {},
    "name": "AppRootQuery",
    "operationKind": "query",
    "text": "query AppRootQuery {\n  composers {\n    id\n    ...ComposerSummary_composer\n  }\n}\n\nfragment ComposerSummary_composer on Composer {\n  id\n  name\n  works {\n    id\n    name\n    type\n    yearOfPublication\n  }\n}\n"
  }
};
})();
(node as any).hash = '4ab237f8da33a8ac18584f98ef9edb70';
export default node;
