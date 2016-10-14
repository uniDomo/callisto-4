var ModalService = require("services/ModalService");

Vue.component("address-select-group", {

    template: "#vue-address-select-group",

    props: [
        "addressListInvoice",
        "selectedAddressIdInvoice",
        "addressListShipping",
        "selectedAddressIdShipping"
    ],

    data: function()
    {
        return {
            isDifferingShippingAddress: true,
            addressListShippingInit: {},
            selectedAddressIdShippingInit: "",

            selectedAddressInvoice: {},
            addressModalInvoice   : {},
            modalTypeInvoice      : "",
            headlineInvoice       : "",
            addressToEditInvoice  : {},
            addressModalIdInvoice : ""
        };
    },

    /**
     *  Check whether the address list is not empty and select the address with the matching ID
     */
    created: function()
    {
        if (!this.isAddressListEmpty())
        {
            for (var index in this.addressListInvoice)
            {
                if (this.addressListInvoice[index].id === this.selectedAddressIdInvoice)
                {
                    this.selectedAddressInvoice = this.addressListInvoice[index];
                }
            }
        }
        else
        {
            this.addressListInvoice = [];
        }

        this.addressModalIdInvoice = "addressModal" + this._uid;
    },

    /**
     * Select the address modal
     */
    ready: function()
    {
        this.addressModalInvoice = ModalService.findModal(document.getElementById(this.addressModalIdInvoice));
    },

    methods:
    {
        onCheckChanged: function()
        {
            if (!this.isDifferingShippingAddress)
            {
                this.addressListShippingInit = this.addressListShipping;
                this.selectedAddressIdShippingInit = this.selectedAddressIdShipping;

                this.addressListShipping = this.addressListInvoice;
                this.selectedAddressIdShipping = this.selectedAddressIdInvoice;
            }
            else
            {
                this.addressListShipping = this.addressListShippingInit;
                this.selectedAddressIdInvoice = this.selectedAddressIdShippingInit;
            }
        },

        /**
         * Update the selected address
         * @param index
         */
        onAddressChanged: function(index)
        {
            this.selectedAddressInvoice = this.addressListInvoice[index];

            this.$dispatch("address-changed-invoice", this.selectedAddressInvoice);
        },

        /**
         * Check whether the address list is empty
         * @returns {boolean}
         */
        isAddressListEmpty: function()
        {
            return !(this.addressListInvoice && this.addressListInvoice.length > 0);
        },

        /**
         * Check whether a company name exists and show it in bold
         * @returns {boolean}
         */
        showNameStrong: function()
        {
            return !this.selectedAddressInvoice.name1 || this.selectedAddressInvoice.name1.length === 0;
        },

        /**
         * Show the add icon
         */
        showAdd: function()
        {
            this.modalTypeInvoice = "create";
            this.addressToEditInvoice = {};
            this.updateHeadline();

            $(".wrapper-bottom").append($("#" + this.addressModalIdInvoice));
            this.addressModalInvoice.show();
        },

        /**
         * Show the edit icon
         * @param address
         */
        showEdit: function(address)
        {
            this.modalTypeInvoice = "update";
            this.addressToEditInvoice = address;
            this.updateHeadline();

            $(".wrapper-bottom").append($("#" + this.addressModalIdInvoice));
            this.addressModalInvoice.show();
        },

        /**
         * Close the current modal
         */
        close: function()
        {
            this.addressModalInvoice.hide();
        },

        /**
         * Dynamically create the header line in the modal
         */
        updateHeadline: function()
        {
            var headline;

            if (this.addressTypeInvoice === "2")
            {
                if (this.modalTypeInvoice === "update")
                {
                    headline = Translations.Callisto.orderShippingAddressEdit;
                }
                else
                {
                    headline = Translations.Callisto.orderShippingAddressCreate;
                }
            }
            else if (this.modalTypeInvoice === "update")
            {
                headline = Translations.Callisto.orderInvoiceAddressEdit;
            }
            else
            {
                headline = Translations.Callisto.orderInvoiceAddressCreate;
            }

            this.headlineInvoice = headline;
        }
    },

    watch:
    {
        isDifferingShippingAddress: function()
        {
            this.onCheckChanged();
        }
    },

    events:
    {
        "address-changed": function(message)
        {
            console.log("address-changed");
            console.log("Message: " + message);
        }
    }
});
