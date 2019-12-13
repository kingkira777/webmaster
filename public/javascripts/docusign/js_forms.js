$(function(){
    'use strict';




    //Update Patient Information
    $('#updatePatientInfoForm').ajaxForm({
        dataType : 'json',
        success : function(e){
            console.log(e);
            if(e.message == "updated"){
                swal('Updated', 'Patient Information Successfuly Updated', 'success');
            }
        }
    }); 

    //Add New Patient Forms --------------------------------------------------
    $('#addnewPatinetForm').ajaxForm({
        dataType : 'json',
        success: function(e){
            console.log(e);
            if(e.message == "saved"){
                swal('Saved', 'Successfuly Saved', 'success');
                clear_form('#addnewPatinetForm')
            }
            if(e.message == "exist"){
                swal('Exist', 'Patient MR# is Already Exist', 'warning');
            }
        }
    });



    // Clear Forms 
    var clear_form = function(_form){
        $(':input',_form)
        .not(':button, :submit, :reset, :hidden')
        .val('')
        .prop('checked', false)
        .prop('selected', false);
    };

});