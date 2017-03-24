var RLT = RLT || {};

(function() {
    'use strict'


    // RLT.rowTemplateStr = `<tr id="${year}"><td>${year}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

    var testTasksInfo = {
        '2017-5': [
            {
                name: 'publish vrmb on itch.io',
                description: 'att'
            }
        ]
        ,
        '2020-3': [
            {
                name: 'fuck a girl',
                description: 'I cannot accept dieing without ever having sex ... -_-'
            }
            ,
            {
                name: 'whatever',
                description: 'Test\n\nPlay Project little man?'
            }
        ]
    };

    var curTaskModalTimeKey, curTaskModalSelectId;
    var yearNow, monthNow;

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

        $('#clearBtn').click(function() {
            console.log('clear local storage');
            localStorage.clear();
        });

        $('#task-select').change(function() {
            // console.log(this.value);
            // console.log(this.selectedIndex);

            curTaskModalSelectId = this.selectedIndex;

            if (this.selectedIndex == this.length - 1) {
                // New Task
                clearInputTaskModal();
            } else {
                selectTaskOption( RLT.info.tasks[curTaskModalTimeKey][this.selectedIndex] );
            }
            
        });

        $('#task-submit').click(function() {
            var task = null;


            var taskArray = RLT.info.tasks[curTaskModalTimeKey];



            if (taskArray) {
                if (curTaskModalSelectId < taskArray.length) {
                    // modify cur task
                    task = taskArray[curTaskModalSelectId];
                }
            } else {
                // must be adding new task
                taskArray = RLT.info.tasks[curTaskModalTimeKey] = [];
            }

            
            if ( task === null ) {
                // new task
                
                // if ( !taskArray ) {
                //     taskArray = RLT.info.tasks[curTaskModalTimeKey] = [];
                // }

                task = {};
                taskArray.push(task);
            }

            task.name = $('#task-name-input').val();
            task.description = $('#task-description-input').val();

            


            // update cell
            // $('#' + curTaskModalTimeKey).html(getMonthGridCellLabelStr( taskArray ));
            updateMonthGridCell( curTaskModalTimeKey, taskArray );


            // update storage
            storeInfo();

            

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

            // // TODO: delete testing purpose
            // RLT.info.tasks = testTasksInfo;

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
        // console.log(event);
        
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





    function clearInputTaskModal() {
        $('#task-name-input').val('');
        $('#task-description-input').val('');
    }

    function selectTaskOption( task ) {
        $('#task-name-input').val( task.name );
        $('#task-description-input').val( task.description );
    }



    function updateTaskModal( taskArray ) {
        var taskSelect = $('#task-select');

        if (taskArray) {
            
            if ( Array.isArray( taskArray ) ) {
                var optionStr = '';
                for (var i = 0, len = taskArray.length; i < len; i++) {
                    optionStr += `<option>${taskArray[i].name}</option>`;
                }

                if (len > 0) {
                    selectTaskOption( taskArray[0] );
                } else {
                    clearInputTaskModal();
                }

                optionStr += '<option disabled="disabled">─────</option><option> New Task...</option>';
                taskSelect.html(optionStr);

                curTaskModalSelectId = 0;
            }
        } else {
            clearInputTaskModal();
            taskSelect.html('<option disabled="disabled">─────</option><option> New Task...</option>');

            curTaskModalSelectId = 1;
        }
    }




    window.onClickMonthCell = function ( id ) {
        // console.log( id );

        curTaskModalTimeKey = id;

        $('#task-title-id').text( id );

        
        // var taskArray = RLT.info.tasks[id];
        
        
        updateTaskModal( RLT.info.tasks[id] );
        

        $('#task-modal').modal();
    };




    function updateMonthGridCell( id, taskArray ) {
        var cell = $('#' + id);

        if ( taskArray && Array.isArray( taskArray ) ) {
            cell.html( `<span class="glyphicon glyphicon-asterisk"></span> ${taskArray.length}` );
            if ( taskArray.length > 0 ) {
                if (!cell.hasClass('has-task')) {
                    cell.addClass('has-task');
                }
            }
        } else {
            cell.html('-');
            if (cell.hasClass('has-task')) {
                cell.removeClass('has-task');
            }
        }

        
    }


    /**
     * 
     * 
     * @param {String} id '2017-03'
     * @param {Boolean} past if is past month
     * 
     * @returns {String} html of the grid cell
     */
    function getMonthGridCell( id, past ) {
        var classStr = "col-xs-3 col-sm-2 col-md-1 monthCell";
        var labelStr = '-';

        if (past) {
            classStr += " past";
        }


        var taskArray = RLT.info.tasks[id];

        if (taskArray) {
            classStr += " has-task";
            if ( Array.isArray( taskArray ) ) {
                labelStr = `<span class="glyphicon glyphicon-asterisk"></span> ${taskArray.length}`;
                // labelStr = getMonthGridCellLabelStr( taskArray );
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
        yearNow = parseInt(date.getFullYear());
        monthNow = parseInt(date.getMonth()) + 1;
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

