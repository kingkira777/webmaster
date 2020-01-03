$(function(){
   'use strict'

   // Toggles
   $('.toggle').toggles({
	 on: true,
	 height: 26
   });

   // Input Masks
   $('#dateMask').mask('99/99/9999');
   $('#phoneMask').mask('(999) 999-9999');
   $('#cellMask').mask('(999) 999-9999');
   $('#ssnMask').mask('999-99-9999');
   $('#zipMask').mask('99999');

   // Time Picker
   $('#tpBasic').timepicker();
   $('#tp2').timepicker({'scrollDefault': 'now'});
   $('#tp3').timepicker();

   $(document).on('click','#setTimeButton', function (e){
	 $('#tp3').timepicker('setTime', new Date());
   });

   // Color picker
   $('#colorpicker').spectrum({
	 color: '#0061da'
   });

   $('#showAlpha').spectrum({
	 color: 'rgba(0, 97, 218, 0.5)',
	 showAlpha: true
   });

   $('#showPaletteOnly').spectrum({
	   showPaletteOnly: true,
	   showPalette:true,
	   color: '#DC3545',
	   palette: [
		   ['#1D2939', '#fff', '#0866C6','#23BF08', '#F49917'],
		   ['#DC3545', '#17A2B8', '#6610F2', '#fa1e81', '#72e7a6']
	   ]
   });

});
$(function(){
   'use strict'
   // Datepicker
   $('.fc-datepicker').datepicker({
      format: "dd/mm/yyyy",
	   showOtherMonths: true,
      selectOtherMonths: true,
      todayHighlight: true,
      container : '#painAssessmentModal'
   });
   // $('.fc-datepicker').datepicker( "option", "dateFormat", 'mm/dd/yy');

   $('#datepickerNoOfMonths').datepicker({
	 showOtherMonths: true,
	 selectOtherMonths: true,
	 numberOfMonths: 2
   });

 });
$(function(){
   'use strict';


   $('.select2').select2({
      tags: "true",
      placeholder: "Select an option",
      allowClear: true,
      width : '100%'
   });
 });