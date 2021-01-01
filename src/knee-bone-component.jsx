import React from 'react';
import { BoneComponent } from "./bone-component.jsx";

export class KneeBoneComponent extends BoneComponent {

    constructor(props) {
        super(props);
        this.boneType = "KNEE";
    }
}
