import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('memorials-harness')
export default class MemorialsHarness extends LitElement {
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
      
        <!-- Memorials -->
        <action-card title="Memorials - Get Collection Length" description="Get memorials collection Length"
          action="getCollectionLength" method="get" fields="address">
          <account-widget field="address" label="address to check"></account-widget>
        </action-card>
      
        <action-card title="Memorials - Get Collection IDs" description="Get memorials collection ids"
          action="getCollectionIds" method="get" fields="address">
          <account-widget field="address" label="address to check"></account-widget>
        </action-card>
      
        <action-card title="Memorials - Get Collection detail" description="Get memorials detail" action="getMemorial"
          method="get" fields="address itemID">
          <account-widget field="address" label="address to check"></account-widget>
          <number-widget field="itemID" label="itemID"></number-widget>
        </action-card>
      
        <action-card title="Memorials - Get Memorial Supply" description="Get Memorial Supply" action="getMemorialSupply"
          method="get">
        </action-card>
      
        <action-card title="Memorials - GetVoting Power" description="Get Voting Power" action="getVotingPower" method="get"
          fields="address">
          <account-widget field="address" label="address to check"></account-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
