console.log("Loaded scripts.js!");

var $form = $('form#registration-form'),
		url = 'https://script.google.com/macros/s/AKfycbzRs9ubp91H8272OkOgUmAsPru_PXufneXV_TvDmAu8kzMlV24/exec';
		// url = 'https://script.google.com/macros/s/abcdefghijklmnopqrstuvwxyz1234567890/exec';
		// url = 'https://script.google.com/macros/u/0/s/AKfycbzRs9ubp91H8272OkOgUmAsPru_PXufneXV_TvDmAu8kzMlV24/exec';

$('#submit-form').on('click', function(e) {
	e.preventDefault();
	var jqxhr = $.ajax({
		url: url,
		method: "GET",
		dataType: "json",
		data: $form.serializeObject(),
		beforeSend: function(jqXHR, settings) {
			console.log("beforeSend", settings);
		}
	// }).success(function(success_response) {
	// 	console.log("SUCCESS!!!! YEYYY!!!!", success_response);
	// }).error(function(error_response) {
	// 	console.log("ERROR!!!! BOOO!!!! :( ", error_response);
	}).done(function(data) {
		console.log('done', data);
	}).fail(function(xhr) {
		console.log('fail', xhr);
	});
});