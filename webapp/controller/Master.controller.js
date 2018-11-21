sap.ui.define([
	"SSOTest/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"SSOTest/model/formatter"
], function(BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("SSOTest.controller.Master", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf mNotifyv2.view.view.Master
		 */
		onInit: function() {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.setModel(oViewModel, "masterView");
			/*	oList.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function() {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});*/

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);
			sap.ui.getCore()._sort = 0;
		},
		
		onRefreshButton: function () {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.refreshStore();
			}
		},

		onClearButton: function () {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.clearStore();
			}
		},

		onFlushButton: function () {
			if (typeof sap.hybrid !== 'undefined') {
				sap.hybrid.flushStore();
			}
		},
		
		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("NotifNo", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},
		onSort: function(oEvent) {

			var oList = this.getView().byId("list");
			var olistItem = this.getView().byId("listitem");

			var sKey = oEvent.getSource().getSelectedItem().getKey();

			var odescSorter = new sap.ui.model.Sorter("NotifNo", true); // sort descending
			var oascSorter = new sap.ui.model.Sorter("NotifNo", false); // sort ascending
			var churl = "/NotifSet";

			if (sKey === "sdesc") {

				oList.bindAggregation("items", churl, olistItem, odescSorter);
				//	sap.ui.getCore()._sort = 0;
			} else {

				oList.bindAggregation("items", churl, olistItem, oascSorter);
				//	sap.ui.getCore()._sort = 1;
			}
		},

		// Event Handler for Filetr function

		onFilterChange: function(oEvent) {

			var selectedKey = oEvent.getSource().getSelectedKey();

			if (selectedKey === "NOPR") {
				this._oListFilterState.aSearch = [new Filter("SysStatus", FilterOperator.Contains, "NOPR")];
			} else
			if (selectedKey === "NOCO") {
				this._oListFilterState.aSearch = [new Filter("SysStatus", FilterOperator.Contains, "NOCO")];
			} else
			if (selectedKey === "OSNO") {
				this._oListFilterState.aSearch = [new Filter("SysStatus", FilterOperator.Contains, "OSNO")];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		/*	var firstItem = this.getView().byId("list").getItems()[0];
			this.getView().byId("list").setSelectedItem(firstItem, true);*/

		},

		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		onSemanticButtonPress: function(oEvent) {
			this.getRouter().navTo("createNotification");
		},

		// Navigate to Detail page
		onSelectionChange: function(oEvent) {

			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "NotifNo",
				groupBy: "None"
			});
		},

		_onMasterMatched: function() {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function(mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("NotifNo");
					this.getRouter().navTo("object", {
						objectId: sObjectId
					}, true);
				}.bind(this),
				function(mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},

		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		_showDetail: function(oItem) {

			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("NotifNo")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function() {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel();
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		}

	});

});