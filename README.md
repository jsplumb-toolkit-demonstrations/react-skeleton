<a id="top"></a>
## React Skeleton

This demonstration shows how to perform the basic tasks needed to get a Toolkit application up and running with React. The app was created with `create-react-app`.  The code is documented throughout so this page just gives a brief overview.

This demonstration uses the "component based" approach. If you'd like to see the same demonstration using Hooks, see [this page](demo-react-hooks-skeleton).
 
<a name="imports" ref="react imports" title="Imports"></a>

```javascript
{
    "dependencies":{
        ...
        "jsplumbtoolkit": "file:../../jsplumbtoolkit.tgz",
        "jsplumbtoolkit-react": "file:../../jsplumbtoolkit-react.tgz",
        ...
    }
}
```

### Setup/Initialization

The app consists of a `DemoComponent` which creates a Toolkit instance, and then renders a `JsPlumbToolkitSurfaceCompoment`. In this application we wrap our bootstrap in a `jsPlumbToolkit.ready(..)` function; we don't expect that real world apps will bootstrap themselves in this way.

This is the code for the `DemoComponent` class. We'll refer to this in the sections below.

```jsx harmony
import React from 'react';
import ReactDOM from 'react-dom';

import { JsPlumbToolkitSurfaceComponent }  from 'jsplumbtoolkit-react';
import { jsPlumbToolkit } from 'jsplumbtoolkit';

import { KneeBoneComponent } from './knee-bone-component.jsx';
import { ShinBoneComponent } from './shin-bone-component.jsx';

const randomColor = () => {
    let colors = ['#59bb59', '#c7a76c', '#8181b7', '#703a82', '#cc8080'];
    return colors[Math.floor(Math.random() * colors.length)];
}

jsPlumbToolkit.ready(() => {

    class DemoComponent extends React.Component {

        constructor(props) {
            super(props);
            this.toolkit = jsPlumbToolkit.newInstance();
            this.state = { color:randomColor() };

            this.view = {
                nodes: {
                    "shin": {
                        jsx: (ctx) => { return <ShinBoneComponent color={ctx.props.color} ctx={ctx}/> }
                    },
                    "knee":{
                        jsx: (ctx) => { return <KneeBoneComponent color={ctx.props.color} ctx={ctx}/> }
                    }
                },
                edges:{
                    "default":{
                        connector:"Straight",
                        anchor:"Continuous",
                        overlays:[
                            [ "Label", { location:0.5, label:"${label}"}],
                            [ "Arrow", { location:1} ],
                            [ "Arrow", {location:0, direction:-1}]
                        ],
                        endpoint:"Blank"
                    }
                }
            };

            this.renderParams = {
                layout:{
                    type:"Spring"
                },
                zoomToFit:true,
                consumeRightClick:false
            };
        }

        render() {
            return <div style={{width:"100%",height:"100%",display:"flex"}}>
                <button onClick={this.changeColor.bind(this)} style={{backgroundColor:this.state.color}} className="colorButton">Change color</button>
                <JsPlumbToolkitSurfaceComponent childProps={{color:this.state.color}} renderParams={this.renderParams} toolkit={this.toolkit} view={this.view}/>
            </div>
        }

        componentDidMount() {
            this.toolkit.load({
                url:"data/data.json"
            });

        }
    }

    ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"));

});


```

<a name="rendering"></a>
### Rendering

The Surface is rendered in the `render()` method of the demo component:


```javascript
render() {
    return <div style={{width:"100%",height:"100%",display:"flex"}}>
        <button onClick={this.changeColor.bind(this)} style={{backgroundColor:this.state.color}} className="colorButton">Change color</button>
        <JsPlumbToolkitSurfaceComponent childProps={{color:this.state.color}} renderParams={this.renderParams} toolkit={this.toolkit} view={this.view}/>
    </div>
}
```

It is provided with four attributes:

- `childProps` - a set of props to pass in to the context for any vertex components that are rendered.  See [this page](react-integration#passing-props) for information about this.
- `toolkit` - The instance of the Toolkit to use. We create it in the constructor of the demo component.
- `view` - Options for rendering nodes/groups/ports/edges. 
- `renderParams` - Options for the Surface component

We also render a button that can be used to change the component's "color"; we use that in this demonstration to show how to pass props to vertex components that have been rendered.

#### View

The view is where we configure the renderer for, and behaviour of, nodes, edges, groups and ports. In this demonstration we map two node types, and we're using the `jsx` approach that is new in 2.3.0:

```javascript
this.view = {
    nodes: {
        "shin": {
            jsx: (ctx) => { return <ShinBoneComponent color={ctx.props.color} ctx={ctx}/> }
        },
        "knee":{
            jsx: (ctx) => { return <KneeBoneComponent color={ctx.props.color} ctx={ctx}/> }
        }
    },
    edges:{
        "default":{
            connector:"Straight",
            anchor:"Continuous",
            overlays:[
                [ "Label", { location:0.5, label:"${label}"}],
                [ "Arrow", { location:1} ],
                [ "Arrow", {location:0, direction:-1}]
            ],
            endpoint:"Blank"
        }
    }
};
```

`ShinBoneComponent` and `KneeBoneComponent` are React components, each of which extend a common `BoneComponent`.

We define how the "default" edge type will look - all edges implicitly have this type if one is not provided in the edge data. You can read more about edge types [here](https://docs.jsplumbtoolkit.com/toolkit/current/articles/data-model#node-edge-port-type).

Read more about views [here](https://docs.jsplumbtoolkit.com/toolkit/current/articles/views).
 
 #### Render Params
 
```javascript
 this.renderParams = {
     layout:{
         type:"Spring"
     },
     zoomToFit:true,
     consumeRightClick:false
 };
```

We use a `Spring` layout, we allow right click on the canvas, and we zoom the canvas to fit on data load.


### Components

As mentioned above, `KneeBoneComponent` and `ShinBoneComponent` both extend `BoneComponent`. The source for each is shown below.  Both components use the same template - `bone-component.html` to render themselves.


#### BoneComponent

```javascript
import React from 'react';
import { BaseNodeComponent } from "jsplumbtoolkit-react";

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


```

`BoneComponent` provides the `render` method for its subclasses. ``


#### ShinBoneComponent

```javascript
import React from 'react';
import { BoneComponent } from "./bone-component.jsx";

export class ShinBoneComponent extends BoneComponent {


    constructor(props) {
        super(props)
        this.boneType = "SHIN";
    }
}

```

We extend `BoneComponent` and declare the type of bone to be "SHIN".

#### KneeBoneComponent

```javascript
import React from 'react';
import { BoneComponent } from "./bone-component.jsx";

export class KneeBoneComponent extends BoneComponent {

    constructor(props) {
        super(props)
        this.boneType = "KNEE";
    }
}

```

This is the "KNEE" bone.


<a name="passing-props"></a>
### Passing props to node components

Sometimes it can be useful to change the appearance of your nodes without manipulating the underlying data model. To do this you can arrange for props to be passed through to the components that the Surface renders. This is a two-stage process.  First, you have to pass the props you want to use in to the Surface's `childProps` prop:

```jsx harmony
<JsPlumbToolkitSurfaceComponent childProps={{color:this.state.color}} .../>
```

`childProps` will be passed back as `props` inside the `ctx` object passed to your JSX generator function:

```
jsx: (ctx) => { return <ShinBoneComponent color={ctx.props.color} ctx={ctx}/> }
```

Now, any `setState` on `DemoComponent` that changes `color` will result in the `color` prop being updated for any `ShinBoneComponent`, and the components re-rendering.





 
