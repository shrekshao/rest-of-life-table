var RLT = RLT || {};

(function() {
    'use strict'


    // RLT.rowTemplateStr = `<tr id="${year}"><td>${year}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

    RLT.info = {
        // username: '',
        // dateOfBirth: ''
        lifeSpan: 70,
        tasks: {
            '2020/03': 'fuck a girl'
        }
    };


    window.onload = function() {
        $( "#init-info-form" ).submit( modalFirstTimeSubmit );

        $('#datetimepicker').datepicker({
            minViewMode: 'months',
            format: 'yyyy/mm'
        });


        var localStorageInfo = localStorage.getItem('rltInfo');
        if (!localStorageInfo) {
            // assume first usage
            // pop up init menu
            console.log('first use');
            $('#init-modal').modal({
                backdrop: 'static',
                keyboard: false
            });
        } else {
            RLT.info = JSON.parse(localStorageInfo);
            initTablePage();
        }



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


    function modalFirstTimeSubmit(event) {
        event.preventDefault();
        console.log(event);
        
        RLT.info.username = $('#usernameInput').val();
        var dateOfBirthStr = $('#dateOfBirthInput').val();

        var parts = dateOfBirthStr.split('/')

        RLT.info.dateOfBirth = {
            year: parseInt(parts[0]),
            month: parseInt(parts[1])
        };
        
        storeInfo();
        
        
        $('#init-modal').modal( 'hide' );

        initTablePage();
    }



    function initTablePage() {
        $('#username').text( RLT.info.username );

        // TODO: build abstract

        // build tables
        var table = $('#lifeTable');
        var tbody = table.find('tbody');
        var yearOfBirth = RLT.info.dateOfBirth.year;
        var yearOfDeath = yearOfBirth + RLT.info.lifeSpan;
        // var row;
        var year, age;

        // var rowTemplate = ;

        for (year = yearOfBirth, age = 0; year <= yearOfDeath; year++, age++) {
            // row = RLT.rowTemplateStr

            // tbody.append( RLT.rowTemplateStr );
            tbody.append( `<tr id="${year}"><td>${year}(${age})</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>` );
        }

    }



    function storeInfo() {
        localStorage.setItem('rltInfo', JSON.stringify(RLT.info));
    }





})();

