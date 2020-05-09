import { FrameworkConfiguration } from 'aurelia-framework';
import { AureliaUX } from './aurelia-ux';
export { swatches } from './colors/swatches';
export { shadows } from './colors/shadows';
export { processDesignAttributes } from './designs/design-attributes';
export { PaperRipple } from './effects/paper-ripple';
export { normalizeBooleanAttribute, normalizeNumberAttribute } from './components/html-attributes';
export { getBackgroundColorThroughParents } from './components/background-color-parent';
export { UxComponent } from './components/ux-component';
export { UxInputComponent } from './components/ux-input-component';
export { UxChoiceAttribute } from './components/ux-choice-attribute';
export { UxChoiceContainerAttribute } from './components/ux-choice-container-attribute';
export { Design } from './designs/design';
export { UxTheme } from './styles/ux-theme';
export { StyleEngine } from './styles/style-engine';
export { GlobalStyle } from './styles/global-style';
export { GlobalStyleEngine } from './styles/global-style-engine';
export { AureliaUX } from './aurelia-ux';
export { UXConfiguration } from './ux-configuration';
export declare function configure(config: FrameworkConfiguration, callback?: (config: AureliaUX) => Promise<any>): Promise<AureliaUX>;
