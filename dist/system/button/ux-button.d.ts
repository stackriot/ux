import { ViewResources, View } from 'aurelia-templating';
import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
export declare class UxButton implements Themable {
    resources: ViewResources;
    private styleEngine;
    type: null;
    size: null;
    disabled: boolean;
    theme: null;
    view: View;
    private ripple;
    private button;
    constructor(resources: ViewResources, styleEngine: StyleEngine);
    created(_: any, myView: View): void;
    bind(): void;
    themeChanged(newValue: any): void;
    onMouseDown(e: MouseEvent): boolean;
    onMouseUp(): boolean;
}
