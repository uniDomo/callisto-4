module.exports = (function($)
{

    var paused  = false;
    var timeout = -1;
    var interval;
    var timeRemaining, timeStart;

    var bsModal = $("#bsModal");
    var bsModalCloseButton = $("#bsModalCloseButton");
    var bsModalHeadline = $("#bsModalHeadline");
    var bsModalFooter = $("#bsModalFooter");
    var bsModalBody = $("#bsModalBody");
    var bsModalExecuteButton = $("#bsModalExecuteButton");
    var bsModalCloseButtonFooter = $("#bsModalCloseButtonFooter");

    return {
        findModal: findModal,
        openModal: openModal,
        hideModal: hideModal
    };

    function findModal(element)
    {
        return new Modal(element);
    }

    /**
     * config:
     *      showExecuteButton
     *      executeButtonCaption
     *      onExecute
     *      onClose
     *      headline
     *      body
     *      showCloseButton
     *
     * @param config
     */
    function openModal(config)
    {
        clearModal();
        initModalContent(config);
        setEventHandler(config);
        bsModal.modal('show');
    }

    function initModalContent(config)
    {
        bsModalHeadline.text(config.headline);
        bsModalBody.append(config.body.clone(true, true));
        bsModalExecuteButton.text(config.executeButtonCaption);

        if(config.showCloseButton)
        {
            bsModalCloseButtonFooter.show();
        }
        else
        {
            bsModalCloseButtonFooter.hide();
        }
    }

    function clearModal()
    {
        bsModalCloseButton.off("click");
        bsModalExecuteButton.off("click");
        bsModalCloseButtonFooter.off("click");
        bsModalBody.empty();
    }

    function setEventHandler(config)
    {
        bsModalCloseButton.click(
            function ()
            {
                config.onClose();
                hideModal();
            });

        bsModalExecuteButton.click(
            function ()
            {
                config.onExecute();
            });

        bsModalCloseButtonFooter.click(
            function ()
            {
                config.onClose();
                hideModal();
            });
    }

    function hideModal()
    {
        bsModal.modal('hide');
    }

    function Modal(element)
    {
        var self = this;
        var $bsModal;

        if ($(element).is('.modal'))
        {
            $bsModal = $(element);
        }
        else
        {
            $bsModal = $(element).find('.modal').first();
        }

        return {
            show             : show,
            hide             : hide,
            setTimeout       : setTimeout,
            startTimeout     : startTimeout,
            pauseTimeout     : pauseTimeout,
            continueTimeout  : continueTimeout,
            stopTimeout      : stopTimeout,
            getModalContainer: getModalContainer
        };

        function show()
        {
            $bsModal.modal('show');

            if ($bsModal.timeout > 0)
            {
                startTimeout();
            }

            return self;
        }

        function hide()
        {
            $bsModal.modal('hide');
            return self;
        }

        function getModalContainer()
        {
            return $bsModal;
        }

        function setTimeout(timeout)
        {
            $bsModal.timeout = timeout;

            $bsModal.find('.modal-content').mouseover(function()
            {
                pauseTimeout();
            });

            $bsModal.find('.modal-content').mouseout(function()
            {
                continueTimeout();
            });

            return this;
        }

        function startTimeout()
        {
            timeRemaining = $bsModal.timeout;
            timeStart     = (new Date()).getTime();

            timeout = window.setTimeout(function()
            {
                window.clearInterval(interval);
                hide();
            }, $bsModal.timeout);

            $bsModal.find('.timer').text(timeRemaining / 1000);
            interval = window.setInterval(function()
            {
                if (!paused)
                {
                    var secondsRemaining = timeRemaining - (new Date()).getTime() + timeStart;
                    secondsRemaining     = Math.round(secondsRemaining / 1000);
                    $bsModal.find('.timer').text(secondsRemaining);
                }
            }, 1000);
        }

        function pauseTimeout()
        {
            paused = true;
            timeRemaining -= (new Date()).getTime() - timeStart;
            window.clearTimeout(timeout);
        }

        function continueTimeout()
        {
            paused    = false;
            timeStart = (new Date()).getTime();
            timeout   = window.setTimeout(function()
            {
                hide();
                window.clearInterval(interval);
            }, timeRemaining);
        }

        function stopTimeout()
        {
            window.clearTimeout(timeout);
            window.clearInterval(interval);
        }
    }
})(jQuery);
