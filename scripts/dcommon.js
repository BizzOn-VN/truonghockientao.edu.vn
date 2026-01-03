var App = App || {};

//---MAIN----
jQuery(function () {
    App.Dev.farosValidate();
    App.Dev.getCurrentDate();
});

//--All site
App.Dev = function(){
    var flag = 1;

    var getCookie = function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    let conversion_id;
    var getTrackData = function() {
        let tracking_id = getCookie('_aff_sid');

        return {
        conversion_id: conversion_id,
        tracking_id: tracking_id
        }
    }

    var trackUser = function() {
        let data = getTrackData();

        jQuery.ajax({
            url: "post.php",
            type: "post",
            dataType:'json',
            data: data,
            success: function (response) {
                console.log(response);
                // You will get response from your PHP page (what you echo or print)
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }

    var register = function(){
        if (jQuery('form#faros').valid() && flag) {
            var data = jQuery('form#faros').serialize();
            console.log(data);
            jQuery('#form-submit').val('Đang gửi...');
            
            flag = 0;

            jQuery.ajax({
                type : 'GET',
                url : 'https://script.google.com/macros/s/AKfycbxPX6ohN1CZPsdCyHS4Rqrxs87V0JITPcpmDAZh-aahq6-NnaUIr0Wuhc4m6it67yY/exec',
                dataType:'json',
                crossDomain : true,
                data : data,
                success : function(data)
                {
                    if(data == 'false')
                    {
                        alert('ERROR, Please try again later!');
                    }else{
                        flag = 1;
                        jQuery('#form-submit').val('Nhận tư vấn');
                        
                        /* if(data.result == 'PHONE_EXIST')
                        {
                            alert('Số điện thoại của bạn đã được đăng ký. \r\nChúng tôi sẽ liên hệ lại với bạn.');
                            return;
                        } */

                        if (data.result == "success") {
                            dataLayer.push({'event': 'gtm-dataLayer-dang-ky-thanh-cong'}); //send GTM
                            gtag('event', 'dang-ky-thanh-cong'); //send GA

                            jQuery('form#faros')[0].reset();

                            $("#modal-sucess").fancybox().trigger('click');
                        }
                    }
                }
            });
        }
    }

    var farosValidate = function(){

        var faros = jQuery('form#faros');
        if (faros.length < 1) {
            return;
        }

        jQuery.validator.addMethod("validatePhone", function (value, element) {
            var flag = false;
            var phone = value;
            phone = phone.replace('(+84)', '0');
            phone = phone.replace('+84', '0');
            phone = phone.replace('0084', '0');
            phone = phone.replace(/ /g, '');
            if (phone != '') {
                var firstNumber = phone.substring(0, 3);
                var validNumber = ["099","095","092","086","088","096","097","098","032","033","034","035","036","037","038","039","089","090","093","070","079","077","076","078","091","094","083","084","085","081","082","092","056","058"];
                if ((jQuery.inArray(firstNumber,validNumber)!='-1') && phone.length == 10) {
                    if (phone.match(/^\d{10}/)) {
                        flag = true;
                    }
                }
            }
            return flag;
        }, "Vui lòng nhập đúng định dạng");

        faros.validate({
            ignore: "",
            rules: {
                'name': {
                    required: true,
                },
                'phone': {
                    required: true,
                    validatePhone:true,
                },
                'email': {
                    required: true,
                    email:true
                },
                'message': {
                    required: false
                }
            },
            messages: {
                'name': {
                    required: "Vui lòng nhập tên của bạn"

                },
                'phone': {
                    required:"Vui lòng nhập số điện thoại",
                    validatePhone: "Vui lòng nhập đúng số điện thoại"
                },
                'email': {
                    required:"Vui lòng nhập email của bạn",
                    email: "Vui lòng nhập đúng định dạng email"
                },
                'message': {
                    required: "Vui lòng nhập nội dung"

                }
            },
            errorElement : 'p',
            errorClass: 'error',
            errorPlacement: function(error, element) {

                error.insertAfter(element);

            },
            highlight: function (element, errorClass) {
                jQuery(element).closest('.form-group').addClass('error');
            },
            unhighlight: function (element, errorClass) {
                jQuery(element).closest('.form-group').removeClass('error');
            },
        });
    }

    var getCurrentDate = function() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        
        $('#current-date').val(today);
    }

    return {
        register: register,
        farosValidate: farosValidate,
        getCurrentDate: getCurrentDate
    };

}();    
//--End All site