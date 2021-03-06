import { __decorate } from "tslib";
import { UxChoiceAttribute } from './ux-choice-attribute';
import { customAttribute, bindingMode, bindable, inject, TaskQueue } from 'aurelia-framework';
let UxChoiceContainerAttribute = /** @class */ (() => {
    let UxChoiceContainerAttribute = class UxChoiceContainerAttribute {
        constructor(element, taskQueue) {
            this.element = element;
            this.taskQueue = taskQueue;
            this.multiple = 'auto';
            this.isMultiple = false;
            this.choices = [];
            this.isQueued = false;
        }
        /* Event passed on the click eventListener */
        handleEvent(event) {
            if (event.target instanceof Element) {
                const choiceElement = event.target.closest('.ux-choice');
                if (choiceElement !== null &&
                    choiceElement.au !== undefined &&
                    choiceElement.au['ux-choice'] !== undefined &&
                    choiceElement.au['ux-choice'].viewModel instanceof UxChoiceAttribute) {
                    const choice = choiceElement.au['ux-choice'].viewModel;
                    this.toggleValue(choice.value);
                }
            }
        }
        /* Callback passed on the TaskQueue when registering child choices */
        call() {
            this.isQueued = false;
            this.processValue();
        }
        bind() {
            this.element.classList.add('ux-choice-container');
            this.multipleChanged();
            this.valueChanged(this.value);
        }
        multipleChanged() {
            if (this.multiple === 'auto') {
                this.isMultiple = Array.isArray(this.value) ? true : false;
            }
            else if (typeof this.multiple === 'boolean') {
                this.isMultiple = this.multiple;
            }
            else {
                this.isMultiple = this.multiple === 'multiple' || this.multiple === 'true';
            }
            this.element.classList.toggle('ux-choice-container--multiple', this.isMultiple);
        }
        attached() {
            this.element.addEventListener('click', this);
        }
        detached() {
            this.element.removeEventListener('click', this);
        }
        requestProcessValue() {
            if (!this.isQueued) {
                this.isQueued = true;
                this.taskQueue.queueMicroTask(this);
            }
        }
        registerChoice(choice) {
            this.choices.push(choice);
            this.requestProcessValue();
        }
        disposeChoice(choice) {
            const index = this.choices.indexOf(choice);
            if (index !== -1) {
                this.choices.splice(index, 1);
                this.requestProcessValue();
            }
        }
        valueChanged(newValue) {
            if (this.multiple === 'auto') {
                this.multipleChanged(); // call this to ensure isMultiple respect value type
            }
            // Before to process the value, let's make
            // it's the proper type according to `isMultiple`
            if (this.isMultiple && typeof newValue === 'string') {
                this.value = [];
                return;
            }
            else if (!this.isMultiple && Array.isArray(newValue)) {
                this.value = undefined;
                return;
            }
            // By using requestProcessValue we avoid too many
            // process in case the value changes quickly
            // This can happen if the value type must be fixed (above)
            // or if there are several choice registration in a row
            this.requestProcessValue();
        }
        toggleValue(value) {
            if (this.isMultiple && Array.isArray(this.value)) {
                const index = this.value.indexOf(value);
                if (index === -1) {
                    this.value.push(value);
                }
                else {
                    this.value.splice(index, 1);
                }
            }
            else if (!this.isMultiple) {
                this.value = this.value === value ? undefined : value;
            }
            this.processValue();
        }
        processValue() {
            const choicesLength = this.choices.length;
            if (this.isMultiple && Array.isArray(this.value)) {
                for (let index = 0; index < choicesLength; index++) {
                    const choice = this.choices[index];
                    choice.selected = this.value.indexOf(choice.value) !== -1;
                }
            }
            else if (!this.isMultiple && typeof this.value === 'string') {
                for (let index = 0; index < choicesLength; index++) {
                    const choice = this.choices[index];
                    choice.selected = this.value === choice.value;
                }
            }
        }
    };
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay, primaryProperty: true })
    ], UxChoiceContainerAttribute.prototype, "value", void 0);
    __decorate([
        bindable
    ], UxChoiceContainerAttribute.prototype, "multiple", void 0);
    UxChoiceContainerAttribute = __decorate([
        customAttribute('ux-choice-container', undefined, ['ux-choice-value']),
        inject(Element, TaskQueue)
    ], UxChoiceContainerAttribute);
    return UxChoiceContainerAttribute;
})();
export { UxChoiceContainerAttribute };
//# sourceMappingURL=ux-choice-container-attribute.js.map