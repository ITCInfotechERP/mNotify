sap.ui.define([
	"SSOTest/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"SSOTest/model/formatter",
	"sap/ui/core/Fragment"
], function(BaseController, JSONModel, formatter, Fragment) {
	"use strict";

	return BaseController.extend("SSOTest.controller.Detail", {

		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf mNotifyv2.view.view.Detail
		 */
		onInit: function() {
			/*	var oRouter = this.getRouter();*/
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			/*	oRouter.getRoute("object").attachMatched(this._onRouteMatched, this);*/
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
		},

		onExit: function() {
			if (this._oPopoverEquip) {
				this._oPopoverEquip.destroy();
			}
			if (this._oPopoverLoc) {
				this._oPopoverLoc.destroy();
			}
		},

		// Event handler for Equipment Link

		OnLocationPress: function(oEvent) {
			// create popover
			if (!this._oPopoverLoc) {
				this._oPopoverLoc = sap.ui.xmlfragment("SSOTest.Fragment.Location", this);
				this.getView().addDependent(this._oPopoverLoc);

			}

			this._oPopoverLoc.openBy(oEvent.getSource());
		},

		// Event handler for Equipment Link

		onEquipmentPress: function(oEvent) {
			// create popover
			if (!this._oPopoverEquip) {
				this._oPopoverEquip = sap.ui.xmlfragment("SSOTest.Fragment.Popover", this);
				this.getView().addDependent(this._oPopoverEquip);

			}

			this._oPopoverEquip.openBy(oEvent.getSource());
		},

		onClickOkEquip: function(oEvent) {
			this._oPopoverEquip.close();

		},

		onClickOkLoc: function(oEvent) {
			this._oPopoverLoc.close();

		},

		onOrderPress: function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("orderDetail", {
				orderID: oCtx.getProperty("Orderid")
			});
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("NotifSet", {
					NotifNo: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},
		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		/*	_onRouteMatched: function(oEvent) {
				var oArgs, oView;

				oArgs = oEvent.getParameter("arguments");
				oView = this.getView();

				oView.bindElement({
					path: "/NotifSet('" + oArgs.objectId + "')",
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function(oEvent) {
							oView.setBusy(true);
						},
						dataReceived: function(oEvent) {
							oView.setBusy(false);
						}
					}
				});
			},*/

		/*	_onBindingChange: function(oEvent) {
				// No data for the binding
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath();

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);
			}*/
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath();
			//offline comment
			// this.getOwnerComponent().oListSelector.selectAListItem(sPath);

		}

	});

});