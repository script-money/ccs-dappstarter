import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('activity-harness')
export default class ActivityHarness extends LitElement {
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
      
        <!-- Activity -->
        <action-card title="Activity - Get Create Consumption" description="Get how many CCS token to create new activity"
          action="getCreateConsumption" method="get">
        </action-card>
      
        <action-card title="Activity - Create Activity" description="User spend token to create activity (set CCSToken first)"
          action="createActivity" method="post" fields="account title content startDate endDate source type_1 type_2">
          <account-widget field="account" label="creator">
          </account-widget>
          <text-widget field="title" label="title" placeholder="test activity 01"></text-widget>
          <text-widget field="content" label="content(optional)"></text-widget>
          <text-widget field="startDate" label="startDate(optional)" placeholder="2021-10-01 20:00+08:00"></text-widget>
          <text-widget field="endDate" label="endDate(optional)" placeholder="2021-10-01 20:00+08:00"></text-widget>
          <text-widget field="source" label="source(optional)">
          </text-widget>
          <text-widget field="type_1" label="type_1"
            placeholder="Interact|Form|Vote|Test|Node|Learn|Create|Develop|Whitelist|IXO|LuckDraw|Register"></text-widget>
          <text-widget field="type_2" label="type_2(optional)"
            placeholder="Create|Develop|Whitelist|IXO|LuckDraw|Register|Interact|Form|Vote|Test|Node|Learn">
          </text-widget>
        </action-card>
      
        <action-card title="Activity - Get Activity Ids" description="Get all activities" action="getActivityIds"
          method="get">
        </action-card>
      
        <action-card title="Activity - Get Activity" description="Get single activity detail" action="getActivity"
          method="get" fields="id">
          <number-widget field="id" label="activity id" placeholder="0"></number-widget>
        </action-card>
      
        <action-card title="Activity - Vote" description="Vote the activity (set ballot first)" action="vote" method="post"
          fields="account activityId isUpVote">
          <account-widget field="account" label="Account">
          </account-widget>
          <number-widget field="activityId" label="activity id" placeholder="0"></number-widget>
          <switch-widget field="isUpVote" label="isUpVote"></switch-widget>
        </action-card>
      
        <action-card title="Activity - Create Airdrop" description="Create an airdrop activity" action="createAirdrop"
          method="post" fields="account title reciever_1 reciever_2 bonus content">
          <account-widget field="account" label="Admin">
          </account-widget>
          <text-widget field="title" label="title"></text-widget>
          <account-widget field="reciever_1" label="reciever 1">
          </account-widget>
          <account-widget field="reciever_2" label="reciever 2">
          </account-widget>
          <number-widget field="bonus" label="bonus" placeholder="0.1"></number-widget>
          <text-widget field="content" label="content"></text-widget>
        </action-card>
      
        <action-card title="Activity - Close Activity"
          description="Close activity then mint NFT (should set accounts memorial storage first)" action="closeActivity"
          method="post" fields="account activityId bonus mintPositive">
          <account-widget field="account" label="Admin">
          </account-widget>
          <number-widget field="activityId" label="activity id" placeholder="0"></number-widget>
          <number-widget field="bonus" label="bonus" placeholder="0.1"></number-widget>
          <switch-widget field="mintPositive" label="mint positive?">
          </switch-widget>
        </action-card>
      
        <action-card title="Activity - Get Reward Params" description="Get Reward Params" action="getRewardParams"
          method="get">
        </action-card>
      
        <action-card title="Activity - Update Reward Params" description="Update Reward Params(Use for offchain computing)"
          action="updateRewardParams" method="post" fields="account maxRatio minRatio averageRatio asymmetry">
          <account-widget field="account" label="Account">
          </account-widget>
          <number-widget field="maxRatio" label="max ratio (optional)" placeholder="5.0"></number-widget>
          <number-widget field="minRatio" label="min ratio (optional)" placeholder="1.0"></number-widget>
          <number-widget field="averageRatio" label="average ratio (optional)" placeholder="1.5"></number-widget>
          <number-widget field="asymmetry" label="asymmetry (optional)" placeholder="2.0"></number-widget>
        </action-card>
      
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
