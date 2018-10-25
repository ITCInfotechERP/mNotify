sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		NotificationType: function(sValue) {
			if (sValue === "M1") {
				return "Maintenance Request";
			} else if (sValue === "M2") {
				return " Malfunction Request";
			} else if (sValue === "M3") {
				return "Activity Report";
			}

		},

		Value: function(sValue) {
			if (sValue === "1") {
				return "Very High";
			} else if (sValue === "2") {
				return "High";
			} else if (sValue === "3") {
				return "Medium";
			} else if (sValue === "4") {
				return "Low";
			}

		},

		sysStatus: function(sValue) {
			if (sValue === "NOPR ORAS") {
				return "Notification In Progress";
			} else if (sValue === "OSNO") {
				return "Outstanding Notification";
			} else if (sValue === "NOCO") {
				return "Notification Completed";
			}
		},

		State: function(sValue) {
			if (sValue === "1") {
				return "Error";
			} else if (sValue === "2") {
				return "Warning";
			} else if (sValue === "3") {
				return "None";
			} else if (sValue === "4") {
				return "Success";
			}

		},

		Date: function(sValue) {
			if (sValue) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});

				return oDateFormat.format(new Date(sValue));
			} else {
				return sValue;
			}
		},
		Breakdown: function(sValue) {
			if (sValue === true) {
				return "Yes";
			} else if (sValue === false) {
				return "No";
			}

		},

		MalfunDetail: function(dt, time) {
			var str = null;

			str = dt;

			if (time !== null) {
				var TZOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
				var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "KK:mm:ss a"
				});
				var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));

			}

			if (str === null) {

				return "N/A";
			} else {
				str = dt.getUTCDate() + '/' + dt.getUTCMonth() + '/' + dt.getUTCFullYear() + " | " + timeStr;
				return str;
			}

		}

	};

});