import { customElement, useView, inject, TaskQueue, PLATFORM, bindable } from "aurelia-framework";
import { UxSidenavDrawer } from "../ux-sidenav-drawer/ux-sidenav-drawer";
import { UxSidenavTheme } from "./ux-sidenav-theme";
import { StyleEngine, normalizeNumberAttribute } from "@aurelia-ux/core";
import { IUxSidenavDrawerElement } from "../ux-sidenav-drawer/i-ux-sidenav-drawer-element";
import { UxDefaultSidenavConfiguration } from "../ux-default-sidenav-configuration";

@inject(Element, StyleEngine, TaskQueue, UxDefaultSidenavConfiguration)
@customElement('ux-sidenav')
@useView(PLATFORM.moduleName('./ux-sidenav.html'))
export class UxSidenav {
  constructor(public element: HTMLElement, private styleEngine: StyleEngine, private taskQueue: TaskQueue,
    private defaultConfig: UxDefaultSidenavConfiguration) { }

  backdrop: boolean = this.defaultConfig.backdrop;
  width: number;

  leftDrawer: UxSidenavDrawer | undefined;
  rightDrawer: UxSidenavDrawer | undefined;
  bottomDrawer: UxSidenavDrawer | undefined;

  private _modalBreakpoint: number = this.defaultConfig.modalBreakpoint;
  @bindable
  public modalBreakpoint: number | string = this.defaultConfig.modalBreakpoint;
  modalBreakpointChanged() {
    this._modalBreakpoint = normalizeNumberAttribute(this.modalBreakpoint) ?? 0;
  }

  @bindable
  public theme: UxSidenavTheme;
  public themeChanged(newValue: UxSidenavTheme) {
    if (newValue !== null && !newValue.themeKey) {
      newValue.themeKey = 'sidenav';
    }

    this.styleEngine.applyTheme(newValue, this.element);
  }

  attached() {
    // todo: refactor this. In the combination of shadowDOM emulation and deeply nested sidenav
    // it's not guaranteeed to  have sidenav populated correctly. The only safe way is to react via children change
    this.leftDrawer = this.element.querySelector<IUxSidenavDrawerElement>('ux-sidenav-drawer[side="left"]')?.au.controller.viewModel;
    this.rightDrawer = this.element.querySelector<IUxSidenavDrawerElement>('ux-sidenav-drawer[side="right"]')?.au.controller.viewModel;
    this.bottomDrawer = this.element.querySelector<IUxSidenavDrawerElement>('ux-sidenav-drawer[side="bottom"]')?.au.controller.viewModel;
    if (this.leftDrawer) {
      this.updatePadding(this.leftDrawer);
      this.leftDrawer.element.addEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.leftDrawerOpenChanged);
    }
    if (this.rightDrawer) {
      this.updatePadding(this.rightDrawer);
      this.rightDrawer.element.addEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.rightDrawerOpenChanged);
    }
    if (this.bottomDrawer) {
      this.updatePadding(this.bottomDrawer);
      this.bottomDrawer.element.addEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.bottomDrawerOpenChanged);
    }
    this.taskQueue.queueTask(() => this.element.classList.add('ux-sidenav--transition'));
  }

  detached() {
    if (this.leftDrawer) {
      this.leftDrawer.element.removeEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.leftDrawerOpenChanged);
    }
    if (this.rightDrawer) {
      this.rightDrawer.element.removeEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.rightDrawerOpenChanged);
    }
    if (this.bottomDrawer) {
      this.bottomDrawer.element.removeEventListener(UxSidenavDrawer.OPEN_CHANGED_EVENT, this.bottomDrawerOpenChanged);
    }
  }

  leftDrawerOpenChanged = () => this.updatePadding(this.leftDrawer!);
  rightDrawerOpenChanged = () => this.updatePadding(this.rightDrawer!);
  bottomDrawerOpenChanged = () => this.updatePadding(this.bottomDrawer!);

  updatePadding(drawer: UxSidenavDrawer) {
    const isModal = this.width <= this._modalBreakpoint;
    const size = drawer.openBoolean && !drawer.isOver() && !isModal
      ? `${drawer.side === 'bottom' ? drawer.element.clientHeight : drawer.element.clientWidth}px`
      : '';
    switch (drawer.side) {
      case 'left':
        this.element.style.paddingLeft = size;
        break;
      case 'right':
        this.element.style.paddingRight = size;
        break;
      case 'bottom':
        this.element.style.paddingBottom = size;
        break;
    }
    this.backdrop = this.leftDrawer?.openBoolean && (this.leftDrawer?.isBackdrop() || isModal)
      || this.rightDrawer?.openBoolean && (this.rightDrawer?.isBackdrop() || isModal)
      || !!this.bottomDrawer?.openBoolean && (this.bottomDrawer?.isBackdrop() || isModal);
  }

  close() {
    const isModal = this.width <= this._modalBreakpoint;
    if (this.leftDrawer && (this.leftDrawer.isBackdrop() || isModal)) {
      this.leftDrawer.open = false;
    }
    if (this.rightDrawer && (this.rightDrawer.isBackdrop() || isModal)) {
      this.rightDrawer.open = false;
    }
    if (this.bottomDrawer && (this.bottomDrawer.isBackdrop() || isModal)) {
      this.bottomDrawer.open = false;
    }
  }
}
