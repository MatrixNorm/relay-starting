/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type WorkKind = "BALLET_SUITE" | "OPERA" | "PIANO_CONCERTO" | "PIANO_ETUDE" | "PIANO_PRELUDE" | "PIANO_SONATA" | "STRING_QUARTET" | "SYMTHONY" | "%future added value";
export type ComposerSummary_composer = {
    readonly id: string;
    readonly name: string;
    readonly works: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
        readonly kind: WorkKind | null;
        readonly yearOfPublication: number | null;
    }> | null;
    readonly " $refType": "ComposerSummary_composer";
};
export type ComposerSummary_composer$data = ComposerSummary_composer;
export type ComposerSummary_composer$key = {
    readonly " $data"?: ComposerSummary_composer$data;
    readonly " $fragmentRefs": FragmentRefs<"ComposerSummary_composer">;
};



const node: ReaderFragment = (function(){
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
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "workKind"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "ComposerSummary_composer",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
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
        (v0/*: any*/),
        (v1/*: any*/),
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
  "type": "Composer",
  "abstractKey": null
};
})();
(node as any).hash = '272f15eeb98bdde81623a0771998424b';
export default node;
