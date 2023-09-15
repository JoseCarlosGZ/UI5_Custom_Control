/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"my_namespace/custom_control/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
