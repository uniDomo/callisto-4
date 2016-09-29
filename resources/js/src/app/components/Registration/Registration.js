var ApiService          = require("services/ApiService");
var NotificationService = require("services/NotificationService");
var ModalService        = require("services/ModalService");
var ValidationService   = require("services/ValidationService");

Vue.component("registration", {

    template: "#vue-registration",

    props: [
        "modalElement",
        "guestMode",
        "isSimpleRegistration"
    ],

    data: function()
    {
        return {
            password      : "",
            passwordRepeat: "",
            username      : "",
            billingAddress: {}
        };
    },

    methods: {
        validateRegistration: function()
        {
            var self = this;

            ValidationService.validate($("#registration" + this._uid))
                .done(function()
                {
                    self.sendRegistration();
                })
                .fail(function(invalidFields)
                {
                    ValidationService.markInvalidFields(invalidFields, "error");
                });
        },

        sendRegistration: function()
        {
            var userObject = this.getUserObject();
            var component  = this;

            ApiService.post("/rest/customer", userObject)
                .done(function(response)
                {
                    ApiService.setToken(response);

                    if ($(component.modalElement).length >= 1)
                    {
                        ModalService.findModal(document.getElementById(component.modalElement)).hide();
                    }

                    NotificationService.success("Erfolgreich registriert").closeAfter(3000);
                });

        },

        getUserObject: function()
        {
            var userObject =
                {
                    contact: {
                        referrerId: 1,
                        typeId    : 1,
                        options   : {
                            typeId: {
                                typeId   : 2,
                                subTypeId: 4,
                                value    : this.username,
                                priority : 0
                            }
                        }
                    }
                };

            if (!this.guestMode)
            {
                userObject.contact.password = this.password;
            }

            if (!this.isSimpleRegistration)
            {
                userObject.billingAddress = this.billingAddress;
            }

            return userObject;
        }
    }
});
