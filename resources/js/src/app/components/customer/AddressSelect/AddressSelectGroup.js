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
            addressListInvoice: this.addressListInvoice,
            selectedAddressIdInvoice: this.selectedAddressIdInvoice,
            addressListShipping: this.addressListShipping,
            selectedAddressIdShipping: this.selectedAddressIdShipping
        };
    },

    methods:
    {
        onCheckChanged: function()
        {
            if (!this.isDifferingShippingAddress)
            {
                this.addressListShipping = this.addressListInvoice;
                this.selectedAddressIdInvoice = this.selectedAddressIdShipping;
            }
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
