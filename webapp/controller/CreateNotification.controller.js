sap.ui.define([
	"SSOTest/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("SSOTest.controller.CreateNotification", {

		onScanClick: function () {
			var that = this;
			var code = "";
			var sScan = this.getView().byId('equipID');
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					code = result.text;
					sap.m.MessageToast.show("This is the code: " + code);
					// var a = document.getElementsByTagName('equipID');
					sScan.setValue(code);
					// var len = a.length;
					// for (var i = 0; i < len; i++) {
					// 	var b = a[i].id;
					// 	if (b.search('br1') >= 0) {
					// 		var c = document.getElementById(b);
					// 		c.value = code;
					// 		cordova.InAppBrowser.open(encodeURI(code), '_system', 'location=yes');
					// 		break;
					// 	}
					// }
					// that.getView().byId("searchField").setValue(code);
					// that.onSearch();
				},
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
		},
		onCameraClick: function () {
			var oInput = this.getView().byId("aimtxt");
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL
			});
			
			function onSuccess(imageData) {
				// var image = document.getElementById('myImage');
				// image.src = "data:image/jpeg;base64," + imageData;
				oInput.setValue("data:image/jpeg;base64," + imageData);
			}

			function onFail(message) {
				alert('Failed because: ' + message);
			}
		},

		onSavePress: function () {
			var flag = true;
			this.getView().setBusyIndicatorDelay(0);
			this.getView().setBusy(true);

			//Notification Type Selection
			var notTypeselect = this.getView().byId("selnottype").getSelectedKey();

			// Subject selection
			var subjText = this.getView().byId("subjtxt").getValue();
			if (subjText === "" || subjText === null) {
				this.getView().byId("subjtxt").setValueState("Error");
				flag = false;
			} else {
				this.getView().byId("subjtxt").setValueState("None");
			}

			// Functional Location Selection
			var funLocation = this.getView().byId("funLoc").getValue();
			if (funLocation === "" || funLocation === null) {
				this.getView().byId("funLoc").setValueState("Error");
				flag = false;
			} else {
				this.getView().byId("funLoc").setValueState("None");
			}

			// Equipment ID Selection
			var equipID = this.getView().byId("equipID").getValue();
			if (equipID === "" || equipID === null) {
				//	MessageToast.show("No Equipment selected");
				this.getView().byId("equipID").setValueState("Error");
				flag = false;
			} else {
				this.getView().byId("equipID").setValueState("None");
			}

			// Priority Key Select
			var entpriorselect = this.getView().byId("selprior").getSelectedKey();
			var priorityKey;
			if (entpriorselect === "Low") {
				priorityKey = "4";
			} else if (entpriorselect === "Medium") {
				priorityKey = "3";
			} else if (entpriorselect === "High") {
				priorityKey = "2";
			} else if (entpriorselect === "Very High") {
				priorityKey = "1";
			}

			if (entpriorselect === "" || entpriorselect === null) {
				//MessageToast.show("No priority selected");
				this.getView().byId("selprior").setValueState("Error");
				flag = false;
			} else {
				this.getView().byId("selprior").setValueState("None");
			}

			// Reported By

			var entreptext = this.getView().byId("reptxt").getValue();
			if (entreptext === "" || entreptext === null) {
				//	MessageToast.show("Reported By cannot be left blank");
				this.getView().byId("reptxt").setValueState("Error");
				flag = false;
			} else {
				this.getView().byId("reptxt").setValueState("None");
			}

			// Breakdown Boolean
			var breakdown = "";
			var entbrdowncbox = this.getView().byId("bdcb").getSelected();
			if (entbrdowncbox) {
				breakdown = true;
			} else {
				breakdown = false;
			}

			// Description

			var entdescripbox = this.getView().byId("textArea").getValue();

			/*----------- Creating a new record and updating the Model------------------ */

			var oEntry = {};
			var that = this;
			oEntry.Notiftype = notTypeselect;
			oEntry.ShortText = subjText;
			oEntry.Priority = priorityKey;
			oEntry.Equipment = equipID;
			oEntry.Reportedby = entreptext;
			oEntry.Description = entdescripbox;
			oEntry.Breakdown = breakdown;

			var path = "/CreateNotifSet";

			var oModel = this.getView().getModel();
			if (flag === true) {
				oModel.create(path, oEntry, {
					success: function (oData, oResponse) {

						var notifId = oData.Notifno;
						var orderId = oData.Orderid;
						//var that = this;
						this.getView().setBusy(false);
						MessageBox.show("Notification " + notifId + " with Order " + orderId + " created successfully", {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: sap.m.MessageBox.Action.OK,
							onClose: function (oAction) {
								that.getModel().refresh(true);
								that.getRouter().navTo("master", {}, true);
							}
						});
						that.getView().byId("subjtxt").setValue("");
						that.getView().byId("funLoc").setValue("");
						that.getView().byId("equipID").setValue("");
						that.getView().byId("reptxt").setValue("");
						that.getView().byId("aimtxt").setValue("");
						that.getView().byId("textArea").setValue("");

					}.bind(this),
					error: function (oError) {
						//alert(JSON.stringify(oError));
						MessageToast.show("Failed to create the Order");
						that.getView().setBusy(false);
					}
				});
			} else {
				this.getView().setBusy(false);
				MessageToast.show("Fill out the Required Fields");
			}

			// Resetting the Value

		},
		onCancelPress: function () {
			this.getView().byId("subjtxt").setValue("");
			this.getView().byId("funLoc").setValue("");
			this.getView().byId("equipID").setValue("");
			this.getView().byId("reptxt").setValue("");
			this.getView().byId("aimtxt").setValue("");
			this.getView().byId("textArea").setValue("");

			//var msg = "Notification creation Cancelled.";
			//MessageToast.show(msg);

			this.getRouter().navTo("master", {}, true);
		}

	});

});