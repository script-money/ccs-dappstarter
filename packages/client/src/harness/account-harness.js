import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('account-harness')
export default class AccountHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
      
        <!-- account -->
        <action-card title="Account - Initialize Account" description="Initialize Account" action="initializeAccount"
          method="post" fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="Account - Is Account Intialized" description="Is Account Intialized" action="isAccountIntialized"
          method="get" fields="address_0 address">
          <account-widget field="address" label="Address to check">
          </account-widget>
        </action-card>
      
        <action-card title="Account - Is Account Intialized(Custom)" description="Is Account Intialized(Custom)"
          action="isAccountIntialized" method="get" fields="address">
          <text-widget field="address" label="Custom address to check" placeholder="0x.....">
          </text-widget>
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
