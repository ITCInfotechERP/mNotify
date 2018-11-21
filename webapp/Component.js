sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"SSOTest/model/models",
	"sap/ui/model/odata/v2/ODataModel"
], function(UIComponent, Device, models, ODataModel) {
	"use strict";

	return UIComponent.extend("SSOTest.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {

			// set the Model
			this.oListSelector = new ListSelector();
			var sUrl = "/sap/opu/odata/sap/Z_MNOTIFY_SRV/";
			var oModel = new ODataModel(sUrl);
			this.setModel(oModel);
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// create the views based on the url/hash
			this.getRouter().initialize();

		}
	});
});