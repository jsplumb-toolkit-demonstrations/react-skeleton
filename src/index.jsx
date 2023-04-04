import React from 'react';
import ReactDOM from 'react-dom';

import { JsPlumbToolkitSurfaceComponent, newInstance } from '@jsplumbtoolkit/browser-ui-react';
import {
    ForceDirectedLayout,
    StraightConnector,
    BlankEndpoint,
    LabelOverlay,
    ArrowOverlay
} from '@jsplumbtoolkit/browser-ui';

import { ShinBoneComponent } from './shin-bone-component.jsx';
import { KneeBoneComponent } from './knee-bone-component.jsx';

const randomColor = () => {
    let colors = ['#59bb59', '#c7a76c', '#8181b7', '#703a82', '#cc8080'];
    return colors[Math.floor(Math.random() * colors.length)];
}

class DemoComponent extends React.Component {


    constructor(props) {
        super(props);
        this.toolkit = newInstance();
        this.state = { color:randomColor() };

        this.view = {
            nodes: {
                "shin":{
                    jsx: (ctx) => { return <ShinBoneComponent color={ctx.props.color} ctx={ctx}/> }
                },
                "knee":{
                    jsx: (ctx) => { return <KneeBoneComponent color={ctx.props.color} ctx={ctx}/> }
                }
            },
            edges:{
                "default":{
                    connector:StraightConnector.type,
                    anchor:'Continuous',
                    overlays:[
                        { type: LabelOverlay.type ,options: { location:0.5, label:"${label}"}},
                        { type: ArrowOverlay.type, options:{ location:1} },
                        { type: ArrowOverlay.type, options:{location:0, direction:-1}}
                    ],
                    endpoint:BlankEndpoint.type
                }
            }
        };

        this.renderParams = {
            layout:{
                type:ForceDirectedLayout.type
            },
            zoomToFit:true,
            consumeRightClick:false
        };
    }

    render() {
        return <div style={{width:"100%",height:"100%",display:"flex"}}>
            <button onClick={this.changeColor.bind(this)} style={{backgroundColor:this.state.color}} className="colorButton">Change color</button>
            <JsPlumbToolkitSurfaceComponent childProps={{color:this.state.color}} renderParams={this.renderParams} toolkit={this.toolkit} view={this.view} />
        </div>
    }

    componentDidMount() {

        window.toolkit = this.toolkit;

        this.toolkit.load({url:"data/data.json"});

        // NOTE if you load data in this method via json and not a url (which is how we originally had this method), we noticed that for some reason the
        // DOM does not always appear to be ready when componentDidMount is called. Other people have run into this issue too:
        // https://stackoverflow.com/questions/49887433/dom-isnt-ready-in-time-after-componentdidmount-in-react
        // wrapping the load in a timeout gets around this problem.
        // setTimeout(() =>{
        //     this.toolkit.load({
        //         data:{
        //             "nodes":[
        //                 { "id":"1", "type":"shin" },
        //                 { "id":"2", "type":"knee" }
        //             ],
        //             "edges":[
        //                 { "source":"1", "target":"2", "data":{"label":"isConnectedTo"}}
        //             ]
        //         }
        //     })
        // })
    }

    changeColor() {
        const current = this.state.color;
        let col;
        while (true) {
            col = randomColor();
            if (col !== current) {
                break;
            }
        }
        this.setState({ color:col } )
    }
}


ReactDOM.render(<DemoComponent/>, document.querySelector(".jtk-demo-canvas"));

