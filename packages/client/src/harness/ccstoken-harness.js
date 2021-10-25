import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('ccstoken-harness')
export default class CCSTokenHarness extends LitElement {
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
      
        <!-- CCS Token -->
        <action-card title="CCS Token - Mint Tokens And Distribute" description="Mint Tokens And Distribute"
          action="mintTokensAndDistribute" method="post"
          fields="account reciever_0 token_0 reciever_1 token_1 reciever_2 token_2 reciever_3 token_3 reciever_4 token_4">
          <account-widget field="account" label="Admin">
          </account-widget>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Reciever 0
          </label>
          <text-widget field="reciever_0" label="Reciever 0" placeholder="(Optional)reciever 0"></text-widget>
          <number-widget field="token_0" label="(Optional)reciever 0 get" placeholder="100.0">
          </number-widget>
          <account-widget field="reciever_1" label="Reciever 1">
          </account-widget>
          <number-widget field="token_1" label="(Optional)reciever 1 get" placeholder="100.0">
          </number-widget>
          <account-widget field="reciever_2" label="Reciever 2">
          </account-widget>
          <number-widget field="token_2" label="(Optional)reciever 2 get" placeholder="100.0">
          </number-widget>
          <account-widget field="reciever_3" label="Reciever 3">
          </account-widget>
          <number-widget field="token_3" label="(Optional)reciever 3 get" placeholder="100.0">
          </number-widget>
          <account-widget field="reciever_4" label="Reciever 4">
          </account-widget>
          <number-widget field="token_4" label="(Optional)reciever 4 get" placeholder="100.0">
          </number-widget>
        </action-card>
      
        <action-card title="CCS Token - Get CCS Balance" description="Get CCS Balance" action="getCCSBalance" method="get"
          fields="account">
          <account-widget field="account" label="Account">
          </account-widget>
        </action-card>
      
        <action-card title="CCS Token - Get CCS Balance(custom)" description="Get CCS Balance(custom)" action="getCCSBalance"
          method="get" fields="account">
          <text-widget field="account" label="account(custom)" placeholder="(Optional)address"></text-widget>
        </action-card>
      
        <action-card title="CCS Token - Get CCS Supply" description="Get CCS Supply" action="getCCSSupply" method="get">
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
