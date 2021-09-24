import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('ballot-harness')
export default class BallotHarness extends LitElement {
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
      
        <action-card title="Ballot - Get Ballot Price" description="Get Ballot Price" action="getPrice" method="get">
        </action-card>
      
        <action-card title="Ballot - Set Ballot Price" description="Set Ballot Price" action="setPrice" method="post"
          fields="account price">
          <account-widget field="account" label="Account">
          </account-widget>
          <number-widget field="price" label="new ballot price" placeholder="3.0">
          </number-widget>
        </action-card>
      
        <action-card title="Ballot - Buy Ballots" description="Buy Ballots" action="buyBallots" method="post"
          fields="account count">
          <account-widget field="account" label="Account">
          </account-widget>
          <number-widget field="count" label="ballots to buy" placeholder="1">
          </number-widget>
        </action-card>
      
        <action-card title="Ballot - Get Ballot Holding" description="Get How Many Ballots User Hold" action="getHoldings"
          method="get" fields="address">
          <account-widget field="address" label="Address">
          </account-widget>
        </action-card>
      
        <action-card title="Ballot - Get Sold Amount" description="Get How Many Ballots Sold" action="getSoldAmount"
          method="get">
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
