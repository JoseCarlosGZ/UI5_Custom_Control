/* eslint-disable no-undef */
//@ts-nocheck
sap.ui.define([
    // A diferencia de un controlador de una vista que hereda de "sap/ui/core/mvc/Controller", el controlador de un componente personalizado hereda 'sap/ui/core/Control. Además tenemos que importar las librerías de los componentes estándar que vayan a formar parte de nuestro control personalizado. En este caso hemos incluido RatingIndicator, Label y Button, pero pueden ser los que deseemos.
    'sap/ui/core/Control',
    'sap/m/RatingIndicator',
    'sap/m/Label',
    'sap/m/Button'
],
    /**
     * 
     * @param {typeof sap.ui.core.Control} Control
     * @param {typeof sap.m.RatingIndicator} RatingIndicator 
     * @param {typeof sap.m.Label} Label 
     * @param {typeof sap.m.Button} Button  
     */
    function (Control, RatingIndicator, Label, Button) {
        'use strict';

        return Control.extend("mynamespace.customcontrol.control.ProductRating", {

            metadata: {
                // Propiedades que tendrá nuestro control. Automáticamente se crean los getters y setters para modificar los valores de dichas propiedades
                properties: {
                    value: { type: "float", defaultValue: 0 }
                },
                // Agragaciones estandar que contendrá nuestro control personalizado
                aggregations: {
                    _rating: {
                        type: "sap.m.RatingIndicator",
                        multiple: false,
                        visibility: "hidden"
                    },
                    _label: {
                        type: "sap.m.Label",
                        multiple: false,
                        visibility: "hidden"
                    },
                    _button: {
                        type: "sap.m.Button",
                        multiple: false,
                        visibility: "hidden"
                    }
                },
                //Eventos y parámetrosq ue tendrá nuestro control
                events: {
                    change: {
                        parameters: {
                            value: { type: "int" }
                        }
                    }
                }
            },
            /* 
            Función donde instanciamos (creamos) las agregaciones (controles estándar) que forman parte de nuestro componente personalizado. La apariencia que tendrán estas agregaciones al renderizarse por primera vez son las que definimos aquí.

            Los eventos de cada control estándar lo vinculamos con una función personalizada con las acciones que indiquemos que hace cada control estandar al renderizarse nuestro componente personalizado que los contiene.
            
            */
            init: function () {

                this.setAggregation(
                    "_rating", 
                    new RatingIndicator(
                        {
                            value : this.getValue(),
                            iconSize: "2rem",
                            visualMode: "Half",
                            maxValue: 3,
                            liveChange: this._onRate.bind(this)
                        }
                   )
                );


                this.setAggregation(
                    "_label", 
                    new Label(  
                            { 
                                text: "{i18n>productRatingLabelInitial}",
                                vAlign: "Bottom"
                            } 
                        ).addStyleClass("sapUiSmallMargin")  
                );


                this.setAggregation( 
                    "_button", 
                    new Button( 
                        {
                             text: "{i18n>productRatingButton}",
                             type: "Emphasized",
                             press: this._onSubmit.bind(this),
                        }
                     ).addStyleClass("sapUiTinyMarginTopBottom")
                );

            },

            //Función que se disparará cada vez que cambie el valor de la agregación _rating → "sap.m.RatingIndicator" 
            _onRate: function(oEvent) {
                // No usamos getView().getModel() porque no estamos en un controlador de una vista
                const oResourceBundle = this.getModel("i18n").getResourceBundle();
                //Obtenermos el valor del nº estrellas seleccionado
                const N_estrellas_seleccionado = oEvent.getParameter("value");
                //Actualizamos el valor de la propiedad value cada vez que presionamos una estrella
                this.setProperty("value", N_estrellas_seleccionado, true);
                //Cambiamos el contenido del sap.m.label al clicar sobre una estrella
                this.getAggregation("_label").setText(oResourceBundle.getText("productRatingIndicator", [N_estrellas_seleccionado,oEvent.getSource().getMaxValue()]));
            },

            //Cada vez que se pulse la agregación button, cambiaremos el contenido de la agregación label
            _onSubmit: function(oEvent) {
                const oResourceBundle = this.getModel("i18n").getResourceBundle();

                this.getAggregation("_rating").setEnabled(false);
                this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelFinal"));
                this.getAggregation("_button").setEnabled(false);
                this.fireEvent("change", {
                    value: this.getValue()
                });
            },

            reset: function() {
                const oResourceBundle = this.getModel("i18n").getResourceBundle();
                this.setValue(0);
                this.getAggregation("_rating").setEnabled(true);
                this.getAggregation("_label").setText(oResourceBundle.getText("productRatingLabelInitial"));
                this.getAggregation("_label").setDesign("Standard");
                this.getAggregation("_button").setEnabled(true);
            },

            setValue: function(fValue) {
                this.setProperty("value", fValue, true);
                this.getAggregation("_rating").setValue(fValue);
            },

            //Este método es necesario para definir la estructura html que tendrá el control una vez interpretado el código de la app por el navegador. El parámetro oRm stands for "object render manager" y es una instancia de la clase sap.ui.core.RenderManager ( https://sapui5.hana.ondemand.com/#/api/sap.ui.core.RenderManager%23methods/Summary ) cuyos métodos nos permiten no sólo abrir y cerrer etiquetas html, sino también añadirles clases... El parámetro oControl se refiere al propio objeto del custom control que estamos creando. 


            //■■■■ En el método renderer indicamos como se tienen que renderizar las agregaciones de nuestro componente en el navegador cuando se convierta a html
            renderer: function (oRm, oControl) {
                oRm.write('<div class="contenedor">'); // Iniciar el contenedor
            
                oRm.write('<div class="contenedorControl">');
                oRm.write('<div id="' + oControl.getId() + '" class="productRating">');
                oRm.renderControl(oControl.getAggregation("_rating"));
                oRm.renderControl(oControl.getAggregation("_label"));
                oRm.renderControl(oControl.getAggregation("_button"));
                oRm.write('</div>');
                oRm.write('</div>');
            
                oRm.write('</div>'); // Finalizar el contenedor
            }

            //■■■■ Esta es otra forma válida de  representar como se van a renderizar las agregaciones de nuestro componente
            // renderer: function (oRm, oControl) {
            //     oRm.write(`
            //         <div class="contenedor">
            //             <div class="contenedorControl">
            //                 <div id="${oControl.getId()}" class="productRating">
            //                     ${oRm.renderControl(oControl.getAggregation("_rating"))}
            //                     ${oRm.renderControl(oControl.getAggregation("_label"))}
            //                     ${oRm.renderControl(oControl.getAggregation("_button"))}
            //                 </div>
            //             </div>
            //         </div>
            //     `);
            // }
            



        });
    });