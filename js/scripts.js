console.log( "scripts loaded" );

/* DECLARE VARS */

var regform = {
	form_validated: false,
	applicant_name: "",
	submission_url: "https://script.google.com/macros/s/AKfycbzRs9ubp91H8272OkOgUmAsPru_PXufneXV_TvDmAu8kzMlV24/exec",
	ip_response: null,
	ip_object: {}
};


/* EVENT HANDLERS */

jQuery(document).ready(function() {
	console.log( "document loaded" );

	/* Hack to change style of the default city option to match other placeholders */
	var $select = jQuery('select');	
	$select.on({
		click: function(ev) {
			// Handle click...
			jQuery(this).removeClass('placeholder');
		},
		focus: function(ev) {
			// Handle click...
			// console.log('focus',ev);
			jQuery(this).removeClass('placeholder');
		}			
	});

	var $radio = jQuery('input[type=radio].is-qualified');	
	$radio.on({
		change: function(ev) {
			// Handle click...
			// console.log('click',ev);
			jQuery('.is-qualified').removeClass('placeholder');
			jQuery("input#experience").hide();
			jQuery("input#experience")[0].required = false;

			// Show 'Notes' field if 'Yes' is selected
			if ( jQuery("input[name='is-qualified']:checked").val() == "true" ) {
				jQuery("input#experience").show();
				jQuery("input#experience").focus();
				jQuery("input#experience")[0].required = true;
			}

		},
		active: function(ev) {
			// Handle click...
			// console.log('active',ev);
			jQuery('.is-qualified').removeClass('placeholder');
		},
		focus: function(ev) {
			// Handle click...
			// console.log('focus',ev);
			jQuery('.is-qualified').removeClass('placeholder');
		}			
	});


	/* Submission Dialog */
	// (function() {  
	// 	var dialog = document.getElementById('popup_confirmation');  
	// 	document.getElementById('show_dialog').onclick = function() {  
	// 		dialog.show();  
	// 	};  
	// 	document.getElementById('close_dialog').onclick = function() {  
	// 		dialog.close();  
	// 	};  
	// })();

	// dialog.close();

	/* Declare form */
	$form = jQuery("form#registration-form");

	/* Prepare for geolocation */
	init_ip ();
});

$("form#registration-form").on("submit", function(evt){
	console.log("submit event handler! return false;");
	evt.preventDefault();
	submitNow();
	return false;
});

/* FUNCTIONS */


modalNotify = function(content="dynamic content", type="info", title="איחוד הצלה - סניף תל אביב", autoCloseMS, hideCloseButton=false ) {
	jQuery("#modal-title").html(title);
	jQuery("#modal-body").html(content);
	jQuery('#myModal1').modal('show');

	if ( hideCloseButton && hideCloseButton == true ){
		jQuery('.modal-footer').hide();	
	} else {
		jQuery('.modal-footer').show();	
	} 

	if ( autoCloseMS ) {
		setTimeout(function () {
			jQuery('#myModal1').modal('hide');
		}, autoCloseMS);
	}
};

init_ip = function (argument) {

	/* https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only */

	// {
	//	  "ip": "116.12.250.1",
	//	  "country_code": "SG",
	//	  "country_name": "Singapore",
	//	  "region_code": "01",
	//	  "region_name": "Central Singapore Community Development Council",
	//	  "city": "Singapore",
	//	  "zip_code": "",
	//	  "time_zone": "Asia/Singapore",
	//	  "latitude": 1.2931,
	//	  "longitude": 103.8558,
	//	  "metro_code": 0
	// }

	jQuery.getJSON('//freegeoip.net/json/?callback=?', function(returnedData,b,c) {
		// console.log(returnedData,b,c);
		if (b && b == "success"){
			regform.ip_response = true;
			regform.ip_object = returnedData;
			// console.log(JSON.stringify(returnedData, null, 2));
			var rip = regform.ip_object;
			regform.user_geo = rip.city + ", " + rip.region_name + ", " + rip.country_code + " (" + rip.ip + ")";
			jQuery("#show-user-geo").html(regform.user_geo);
		} else {
			console.log("IP lookup failed!");
		}
	});
};

getTidyJSON = function(formObject) {
	jQuery("#show-form-status").append("Preparing form data...\<br\>");
	console.log("getTidyJSON()");	
	var tidyjson = formObject.serializeObject();
	if ( !tidyjson.first_name && !tidyjson.family_name ) {
		tidyjson.first_name = tidyjson.full_name.substr( 0, tidyjson.full_name.indexOf(" ") );
		tidyjson.family_name = tidyjson.full_name.substr( tidyjson.full_name.indexOf(" ") + 1 );
	}
	regform.applicant_name = tidyjson.first_name || tidyjson.full_name;

	/* Experience */
	tidyjson.is_qualified = jQuery('input[name=is-qualified]:checked').val();
	/* Check if this live or development form submission */
	tidyjson.form_type = ( !document.domain || document.domain == "localhost" ) ? "development" : document.domain;
	/* TODO Referrer info */
	tidyjson.referrer = document.location.search.substring(0,100) || "--";
	/* Geolocation info */
	tidyjson.user_geo = regform.user_geo;

	console.log(tidyjson);
	return tidyjson;
};

init_jquery_talkahead = function(inputSelector) {
	/* Documentation: http://www.runningcoder.org/jquerytypeahead/documentation/ */
    var data = {
    israel_cities: ["תל אביב-יפו", "אום אל-פחם", "אופקים", "אור יהודה", "אור עקיבא", "אילת", "אלעד", "אריאל", "אשדוד", "אשקלון", "באקה אל-גרבייה", "באר שבע", "בית שאן", "בית שמש", "ביתר עילית", "בני ברק", "בת ים", "גבעת שמואל", "גבעתיים", "דימונה", "הוד השרון", "הרצליה", "חדרה", "חולון", "חיפה", "טבריה", "טייבה", "טירה", "טירת כרמל", "טמרה", "יבנה", "יהוד-מונוסון", "יקנעם עילית", "ירושלים", "כפר יונה", "כפר סבא", "כפר קאסם", "כרמיאל", "לוד", "מגדל העמק", "מודיעין עילית", "מודיעין- מכבים- רעות", "מעלה אדומים", "מעלות תרשיחא", "נהריה", "נס ציונה", "נצרת", "נצרת עילית", "נשר", "נתיבות", "נתניה", "סח'נין", "עכו", "עפולה", "עראבה", "ערד", "פתח תקווה", "צפת", "קלנסווה", "קריית אונו", "קריית אתא", "קריית ביאליק", "קריית גת", "קריית ים", "קריית מוצקין", "קריית מלאכי", "קריית שמונה", "ראש העין", "ראשון לציון", "רהט", "רחובות", "רמלה", "רמת גן", "רמת השרון", "רעננה", "שדרות", "שפרעם", "Other"]
    };
};

isFormValid = function (eventLabel) {
	if ( !jQuery("#registration-form")[0].checkValidity() ){
		regform.form_validated = false;
	} else {
		regform.form_validated = true;
	}
	console.log("isFormValid("+eventLabel+") = " + regform.form_validated);
	return regform.form_validated;
};

submitNow = function (submitTrigger) {
	jQuery("#show-form-status").append("submitNow("+submitTrigger+")\<br\>");
	console.log("submitNow("+submitTrigger+")");
	// alert("submitNow("+submitTrigger+")");

	/* Prevent submission unless all required fields are complete */
	if ( !isFormValid() ) {
		jQuery("#show-form-status").append("Submit Click > form_validated == false\<br\>");
		console.log("FORM NOT VALID");
		return;
	}

	console.log("Submitting now...");
	jQuery("#show-form-status").append("Submit Click > form_validated == true > Submitting now\<br\>");

	// e.preventDefault();
	var jqxhr = jQuery.ajax({
		url: regform.submission_url,
		crossDomain: true,
		method: "GET",
		dataType: "json",
		data: getTidyJSON($form),
		beforeSend: function(jqXHR, settings) {
			doSendingActions(jqXHR, settings);
		}
	}).done(function(data) {
		doSuccessActions(data, regform);
	}).fail(function(xhr) {
		doFailActions(data, regform);
	});
};

doSendingActions = function (jqXHR, settings = {}) {
	jQuery("#show-form-status").append("Preparing to send data...\<br\>");
	console.log("beforeSend", settings);
	var notifyHTML = "<span class='loading-icon'><span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span></span><span class='loading-text'>מגיש פרטים כעת... נא לחכות כמה שניות</span>";
	modalNotify( notifyHTML , "Sending", "מגיש פרטים", false, true );
};

doFailActions = function (xhr, regform = {}) {
	console.log("fail", xhr);
	jQuery("#show-form-status").append("Submission failed\<br\>");
	var failMessage = "זה נראה כאילו משהו לא עובד. בבקשה נסה שוב.<br><br>אם זה לא מצליח, אנא שלח לנו את הפרטים שלך:<br><a href='mailto:davidl@1221tlv.org.il' target='_blank'>davidl@1221tlv.org.il</a>";
	modalNotify( failMessage , "error", "אוי וי!", 12000 );
};

doSuccessActions = function (data, regform = {}) {
	console.log("done!", doneMessage, data);
	jQuery("#show-form-status").append("Submission successful!\<br\>");
	// alert(doneMessage);
	jQuery("#registration-form")[0].reset();
	// var applicant_name = (regform.applicant_name) ? (" " + regform.applicant_name) :  "";
	// var doneMessage = "תודה"+applicant_name+", הפרטים שלך נשלחו בהצלחה!";
	// modalNotify( doneMessage , "success", "איחוד הצלה - סניף תל אביב", 8000 );
	var applicant_name = (regform.applicant_name) ? (" " + regform.applicant_name) :  "";
	var doneMessage = "תודה לך על התעניינותך!<br><br>מישהו מ-איחוד הצלה ייצור איתך קשר בקרוב.";
	modalNotify( doneMessage , "success", "הפרטים שלך נשלחו בהצלחה!", 12000 );
};
