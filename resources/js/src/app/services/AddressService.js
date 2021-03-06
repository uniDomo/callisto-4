var ApiService      = require('services/ApiService');
var CheckoutService = require('services/CheckoutService');

module.exports = (function($)
{

    return {
        createAddress: createAddress,
        updateAddress: updateAddress
    };

    function createAddress(address, addressType, setActive)
    {
        return ApiService.post("rest/customer/address?typeId=" + addressType, address).done(function(response)
        {
            if (!!setActive)
            {
                if (addressType === 1)
                {
                    CheckoutService.setBillingAddressId(response.id);
                }
                else if (addressType === 2)
                {
                    CheckoutService.setDeliveryAddressId(response.id);
                }
            }
        });
    }

    function updateAddress(newData, addressType)
    {
        addressType = addressType || newData.pivot.typeId;
        return ApiService.put("rest/customer/address/" + newData.id + "?typeId=" + addressType, newData);
    }

    function deleteAddress(addressId, addressType)
    {
        return ApiService.delete("rest/customer/address/" + addressId + "?typeId=" + addressType);
    }
})(jQuery);
