var ModalService = require("services/ModalService");
var CheckoutService = require("services/CheckoutService");

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
            selectedAddressInvoice: {},
            selectedAddressShipping: {},

            modalType: "",
            headline: "",
            addressModal: {},
            addressModalId: ""
        };
    },

    /**
     *  Check whether the address list is not empty and select the address with the matching ID
     */
    created: function()
    {
        if (!this.isAddressListEmptyInvoice())
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

        // Adds the "same as invoice address" to the dropdown
        this.addressListShipping.unshift({
            id: -999
        });

        if (!this.isAddressListEmptyShipping())
        {
            var isAddressSet = false;

            for (var index2 in this.addressListShipping)
            {
                if (this.addressListShipping[index2].id === this.selectedAddressIdShipping)
                {
                    this.selectedAddressShipping = this.addressListShipping[index2];
                    isAddressSet = true;
                }
            }

            if (!isAddressSet)
            {
                this.selectedAddressShipping = this.addressListShipping[0];
            }
        }
        else
        {
            this.addressListShipping = [];
        }

        this.addressModalId = "addressModal" + this._uid;
    },

    /**
     * Select the address modal
     */
    ready: function()
    {
        this.addressModal = ModalService.findModal(document.getElementById(this.addressModalId));
    },

    methods:
    {
        /**
         * Update the selected invoice address
         * @param index
         */
        onAddressChangedInvoice: function(index)
        {
            this.selectedAddressInvoice = this.addressListInvoice[index];

            CheckoutService.setBillingAddressId(this.selectedAddressInvoice.id);
        },

        /**
         * Update the selected shipping address
         * @param index
         */
        onAddressChangedShipping: function(index)
        {
            this.selectedAddressShipping = this.addressListShipping[index];

            CheckoutService.setDeliveryAddressId(this.selectedAddressShipping.id);
        },

        /**
         * Check whether the invoice address list is empty
         * @returns {boolean}
         */
        isAddressListEmptyInvoice: function()
        {
            return !(this.addressListInvoice && this.addressListInvoice.length > 0);
        },

        /**
         * Check whether the shipping address list is empty
         * @returns {boolean}
         */
        isAddressListEmptyShipping: function()
        {
            return !(this.addressListShipping && this.addressListShipping.length > 0);
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
        showAdd: function(addressType)
        {
            this.modalType = "create";
            this.addressToEdit = {};
            this.updateHeadline(addressType);

            $(".wrapper-bottom").append($("#" + this.addressModalId));
            this.addressModal.show();
        },

        /**
         * Show the edit icon
         * @param address
         */
        showEdit: function(address)
        {
            this.modalType = "update";
            this.addressToEdit = address;
            this.updateHeadline();

            $(".wrapper-bottom").append($("#" + this.addressModalId));
            this.addressModal.show();
        },

        /**
         * Close the current modal
         */
        close: function()
        {
            this.addressModal.hide();
        },

        /**
         * Dynamically create the header line in the modal
         */
        updateHeadline: function(addressType)
        {
            var headline;

            if (addressType === "2")
            {
                if (this.modalType === "update")
                {
                    headline = Translations.Callisto.orderShippingAddressEdit;
                }
                else
                {
                    headline = Translations.Callisto.orderShippingAddressCreate;
                }
            }
            else if (this.modalType === "update")
            {
                headline = Translations.Callisto.orderInvoiceAddressEdit;
            }
            else
            {
                headline = Translations.Callisto.orderInvoiceAddressCreate;
            }

            this.headline = headline;
        }
    }
});
