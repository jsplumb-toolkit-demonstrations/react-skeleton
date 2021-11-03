import React from 'react';
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-react";

export class BoneComponent extends BaseNodeComponent {

    constructor(props) {
        super(props)
        this.boneType = "";
    }

    render() {
        return <div style={{backgroundColor:this.props.color}}>
            <div style={{fontSize:"12px",textTransform:"uppercase"}}>{this.node.data.type} bone</div>
            <div style={{fontSize:"12px",textTransform:"uppercase"}}>{this.node.data.label}</div>
            <button onClick={this.hitMe.bind(this)}>Hit.</button>
        </div>
    }

    setLabel(label) {
        this.updateNode({ label })
    }

    hitMe() {
        this.setLabel("OUCH. My " + this.boneType);
        setTimeout(() => {
            this.setLabel(null);
        }, 2500)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.surface && this.surface.repaint(this.vertex);
    }
}
