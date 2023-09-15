sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("mynamespace.customcontrol.controller.App", {
            onInit: function () {

            },
            onRatingChange: function(oEvent) {
                const fValue = oEvent.getParameter("value");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                sap.m.MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
            },

            onResetCtrlPersonalizado: function() {
                this.getView().byId("CtrlPersonalizado01").reset();
                this.getView().byId("CtrlPersonalizado02").reset();
                this.getView().byId("CtrlPersonalizado03").reset();
            }
        });
    });
