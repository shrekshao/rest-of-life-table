var RLT = RLT || {};

(function() {
    'use strict'


    // RLT.rowTemplateStr = `<tr id="${year}"><td>${year}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

    var testTasksInfo = {
        '2020-3': [
            {
                name: 'fuck a girl',
                des: 'I cannot accept dieing without ever having sex ... -_-'
            }
        ]
    };


    RLT.info = {
        // username: '',
        // dateOfBirth: ''
        lifeSpan: 70,
        tasks: {}
    };


    window.onload = function() {
        $( "#init-info-form" ).submit( modalFirstTimeSubmit );

        $('#datetimepicker').datepicker({
            minViewMode: 'months',
            format: 'yyyy/mm',
            autoclose: true,
            startView: 'decade'
        });

        $('#clearBtn').click(function(){
            console.log('clear local storage');
            localStorage.clear();
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

            // TODO: delete testing purpose
            RLT.info.tasks = testTasksInfo;

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



    window.onClickMonthCell = function ( id ) {
        console.log( id );


        $('#task-title-id').text( id );

        $('#task-modal').modal();
    };




    /**
     * 
     * 
     * @param {String} id '2017-03'
     * @param {Boolean} past if is past month
     * 
     * @returns {String} html of the grid cell
     */
    function getMonthGridCell( id, past ) {
        var classStr = "col-xs-3 col-sm-2 col-md-1";
        var labelStr = '-';

        if (past) {
            classStr += " past";
        }


        var taskArray = RLT.info.tasks[id];

        if (taskArray) {
            classStr += " has-task";
            if ( Array.isArray( taskArray ) ) {
                labelStr = `<span class="glyphicon glyphicon-asterisk"></span> ${taskArray.length}`;
            }
        }


        return `<div class='${classStr}' id=${id} onclick="onClickMonthCell('${id}')">${labelStr}</div>`
    }






    function initTablePage() {
        $('#username').text( RLT.info.username );

        // TODO: build abstract

        // build tables

        var table = $('#lifeTable');
        // var tbody = table.find('tbody');
        var tbody = $('#future');
        var pastSection = $('#past');
        var yearOfBirth = RLT.info.dateOfBirth.year;
        var yearOfDeath = yearOfBirth + RLT.info.lifeSpan;

        var date = new Date();
        var yearNow = parseInt(date.getFullYear());
        var monthNow = parseInt(date.getMonth()) + 1;
        // var row;
        var year, age;




        if ( yearOfBirth < yearNow) {


            $('#topRows').append(`
            <div class="card-header accordion-toggle" data-toggle="collapse" data-target="#past" aria-expanded="true">
              <a href='#'>${yearOfBirth} - ${yearNow - 1}</a>
            </div>
            `);
        }

        for (year = yearOfBirth, age = 0; year <= yearOfDeath; year++, age++) {
            // row = RLT.rowTemplateStr


            if (year < yearNow) {
                // collapse

                // pastSection.append( 
                // `<tr id="${year}" >
                // <td>${year}(${age})
                // </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                // </tr>` );

                pastSection.append( 
                `<div class='row' id="${year}" >
                <div class='col-xs-3 col-sm-2 col-md-1'>${year}(${age})</div>
                <div class="col-xs-9 col-sm-10 col-md-11" id="${year}-row">
                </div>
                </div>` );

                var curYearRow = $(`#${year}-row`);

                for (var m = 1; m <= 12; m++) {
                    curYearRow.append( getMonthGridCell( `${year}-${m}`, true ) );
                }
            } else if (year === yearNow) {
                tbody.append(
                `<div class='row' id="${year}" >
                    <div class='col-xs-3 col-sm-2 col-md-1'>${year}(${age})</div>
                    <div class="col-xs-9 col-sm-10 col-md-11" id="${year}-row">
                    </div>
                    </div>
                `);

                var curYearRow = $(`#${year}-row`);

                for (var m = 1; m < monthNow; m++) {
                    curYearRow.append( getMonthGridCell( `${year}-${m}`, true ) );
                }

                for (m = monthNow; m <= 12; m++) {
                    curYearRow.append( getMonthGridCell( `${year}-${m}`, false ) );
                }
            } else {
                // tbody.append( `<tr id="${year}">
                // <td>${year}(${age})
                // </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                // </tr>` );

                tbody.append(
                `<div class='row' id="${year}" >
                    <div class='col-xs-3 col-sm-2 col-md-1'>${year}(${age})</div>
                    <div class="col-xs-9 col-sm-10 col-md-11" id="${year}-row">
                    </div>
                    </div>
                `);

                var curYearRow = $(`#${year}-row`);

                for (var m = 1; m <= 12; m++) {
                    curYearRow.append( getMonthGridCell( `${year}-${m}`, false ) );
                }
            }
        }

    }



    function storeInfo() {
        localStorage.setItem('rltInfo', JSON.stringify(RLT.info));
    }





})();

