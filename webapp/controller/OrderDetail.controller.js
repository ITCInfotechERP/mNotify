sap.ui.define([
	"SSOTest/controller/BaseController",
	"SSOTest/model/formatter"
], function(BaseController, formatter) {
	"use strict";

	return BaseController.extend("SSOTest.controller.OrderDetail", {

		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf SSOTest.view.view.OrderDetail
		 */
		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("orderDetail").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var oArgs, oView;

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path: "/PMOrderSet('" + oArgs.orderID + "')",
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
		},

		_onBindingChange: function(oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

	});

});