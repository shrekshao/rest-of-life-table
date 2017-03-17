var RLT = RLT || {};

(function() {
    'use strict'




    window.onload = function() {
        $( "#init-info-form" ).submit( function( event ) {
            event.preventDefault();
            console.log(event);
            // alert( "Handler for .submit() called." );
            $('#init-modal').modal( 'hide' );
        });

        $('#datetimepicker').datepicker({
            minViewMode: 'months',
            format: 'yyyy/mm'
        });




        initApp();


        // $("#row-1993").click(function() {
        //     var self = $("#row-1993");
        //     console.log(self);
        //     if(self.hasClass("out")) {
        //         self.addClass("in");
        //         self.removeClass("out");
        //     } else {
        //         self.addClass("out");
        //         self.removeClass("in");
        //     }
        // });

    };



    function initApp() {
        
        if (!localStorage.getItem('username')) {
            // assume first usage
            // pop up init menu
            console.log('first use');
            $('#init-modal').modal({
                backdrop: 'static',
                keyboard: false
            });
        } else {
        }
    }







})();

