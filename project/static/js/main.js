// //login javascript

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

$('#registerModal').on('shown.bs.modal', function () {
    $('#email_log').focus(); 
});

$('#registerModal').on('hidden.bs.modal', function () {
    $('#text-1').css('display', 'none')
    $('#text-2').css('display', 'block')
    $('#text-3').css('display', 'none')
    $('#text-4').css('display', 'block')
    $('#text-5').css('display', 'none')
    $('#name').val('')
    $('#pass').val('')
    $('#pass_log').val('')
    $('#email').val('')
    $('#email_log').val('')
    var btn = document.getElementById('btn');
var btn_log = document.getElementById('btn_log');
    if (btn.getAttribute('type') === 'submit' || btn_log.getAttribute('type') === 'submit'){
    btn.setAttribute('type', 'button');
    btn_log.setAttribute('type', 'button');
    btn.innerText = 'Continue'
    btn_log.innerText = 'Continue'
}
});


    function to_reg(){
        var reg = document.getElementById('reg')
var log = document.getElementById('log')

        if (reg.style.display === 'none'){
            log.style.display = 'none';
            reg.style.display = 'block';
            $('#email').focus();
            $('#text-4').css('display', 'block');
            $('#text-5').css('display', 'none');
            $('#btn').attr('type' , 'button').html('Continue');
            $('#pass').val('')
            $('#name').val('')
        }

        else if (log.style.display === 'none'){
            reg.style.display = 'none';
            log.style.display = 'block';
            $('#email_log').focus();
            $('#text-2').css('display', 'block');
            $('#text-3').css('display', 'none');
            $('#text-1').css('display', 'none');
            $('#btn_log').attr('type' , 'button').html('Continue');
            $('#pass_log').val('')
        }
    }

    function next(){
        const name = document.getElementById('text-1');
        const pass = document.getElementById('text-3');
        const email = document.getElementById('text-2');
        const btn = document.getElementById('btn');


        if (btn.type === 'submit') {
    const registerdata = {
        username: document.getElementById('name').value,
        password: document.getElementById('pass').value,
        email: document.getElementById('email').value,
    };

    $.ajax({
        url: 'http://127.0.0.1:8000/api/register',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json', 
        },
        data: JSON.stringify(registerdata), 
        success: function(data){
        console.log('New user created:', data.message);
        console.log(registerdata)
        $('#registerModal').modal('hide'); 
        location.reload();

    },
        error: function(error) {
            console.error(error);
        }
    });
    } else if (name.style.display === 'none' && pass.style.display === 'none'){
        document.getElementById('password-error').innerHTML = '';
        email_value = $('#email').val()

if (email_value.endsWith("@gmail.com")) {
    console.log("Email contains @gmail.com");
    // console.log(email_value)
    

    $.ajax({
            url: 'http://127.0.0.1:8000/api/email_check',
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({'email_value': email_value}),
            success: function(response){
                if (response.email_exists === true){
                    reg.style.display = 'none';
                    log.style.display = 'block';
                    $('#email_log').val(email_value).focus();
                    $('#email').val('')
                    var notification = document.getElementById('notification');
                    notification.style.display = 'block';
                    notification.innerHTML = 'Look like your E-mail already link with us So Login now!'
                    setTimeout(function() {
                        notification.style.transform = 'translateX(-50%) scale(0)';
                        setTimeout(function() {
                            notification.style.display = 'none';
                            notification.style.transform = 'translateX(-50%) scale(1)';
                        }, 500); 
                    }, 5000);

                  
                    notification.style.position = 'fixed';
                    notification.style.bottom = '5%';
                } else{
                    pass.style.display = 'block';
                    email.style.display = 'none';
                    $('#pass').focus();
                    document.getElementById('password-error').innerHTML = 'Password must have at least 8 characters';
                    document.getElementById('password-error').style.color = '';
                    // console.log('sucess')
                }
            },
            error: function(error){
                console.log(error)
            },
        }); 
} else {
    document.getElementById('password-error').innerHTML = 'Check Your Gmail ID correctly';
    console.log("Email does not contain @gmail.com");
    document.getElementById('password-error').style.color = 'red';
            document.getElementById('pass_shake').classList.add('shake');
            setTimeout(function () {
    document.getElementById('pass_shake').classList.remove('shake');
}, 1000);
}
        
                  
    } else if (email.style.display === 'none' && name.style.display === 'none'){
        document.getElementById('pass_shake').classList.remove('shake');
        //
        var passwordInput = document.getElementById('pass');
        if (passwordInput.value.length >= 8){
            $('#password-error').text('');
            name.style.display = 'block';
            pass.style.display = 'none';
            $('#name').focus();
            btn.type = 'submit';
            btn.innerText = 'Register'
            
        }else{
            document.getElementById('password-error').style.color = 'red';
            document.getElementById('pass_shake').classList.add('shake');
            setTimeout(function () {
    document.getElementById('pass_shake').classList.remove('shake');
}, 1000);
        }
        
    }
} 

    $('#pass').on('input', function(){
        var password_value = $(this).val();
        var spanerror = $('#password-error');
        if (password_value.length >= 8){
            spanerror.css('color', 'green')
        }else{
            spanerror.css('color', 'red')
        }
    });

    function next_login(){

        const pass = document.getElementById('text-5');
        const email = document.getElementById('text-4');
        const btn = document.getElementById('btn_log');


        if (btn.type === 'submit') {
    const registerdata = {
        password: document.getElementById('pass_log').value,
        email: document.getElementById('email_log').value,
    };

    $.ajax({
        url: 'http://127.0.0.1:8000/api/login',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json', 
        },
        data: JSON.stringify(registerdata), 
        success: function(response){
        // console.log('login sucess:', data.message);
        console.log(response)
        if (response.login === true) {
            $('#registerModal').modal('hide'); 
            location.reload();
        } else {
            console.log('Login failed');
            var notification = document.getElementById('notification');
            notification.style.display = 'block';
            notification.innerHTML = 'Your email ID or password was wrong.'
            setTimeout(function() {
                notification.style.transform = 'translateX(-50%) scale(0)';
                setTimeout(function() {
                    notification.style.display = 'none';
                    notification.style.transform = 'translateX(-50%) scale(1)';
                }, 500); 
            }, 3000);
        }
        // $('#registerModal').modal('hide');
    },
        error: function(error) {
            console.error(error);
        }
    });
}
    
        else if (pass.style.display === 'none'){
            var email_value = $('#email_log').val();
            document.getElementById('password-error1').innerHTML= '';
            if (email_value.endsWith('@gmail.com')){
                $.ajax({
                url: 'http://127.0.0.1:8000/api/email_check',
                type: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({'email_value': email_value}),
                success: function(response){
                    if (response.email_exists === false){
                        reg.style.display = 'block';
                        log.style.display = 'none';
                        $('#email').val(email_value).focus();
                        $('#email_log').val('')
                        var notification = document.getElementById('notification');
                        notification.style.display = 'block';
                        notification.innerHTML = 'You are already registered. Please log in.'
                        setTimeout(function() {
                            notification.style.transform = 'translateX(-50%) scale(0)';
                            setTimeout(function() {
                                notification.style.display = 'none';
                                notification.style.transform = 'translateX(-50%) scale(1)';
                            }, 500); 
                        }, 5000);

                    
                        notification.style.position = 'fixed';
                        notification.style.bottom = '5%'; 
                    }else{
                        pass.style.display = 'block';
                        email.style.display = 'none';
                        $('#pass_log').focus();
                        btn.type = 'submit'
                        btn.innerText = 'Login';
                    }
                }
            })           
            } else{
                document.getElementById('password-error1').innerHTML = 'Check Your Gmail ID correctly';
    console.log("Email does not contain @gmail.com");
    document.getElementById('password-error1').style.color = 'red';
            document.getElementById('pass_shake1').classList.add('shake');
            setTimeout(function () {
    document.getElementById('pass_shake1').classList.remove('shake');
}, 1000);
            }
            
        }
    } 


//home javascipt

function view(id){
    window.location.href= `http://127.0.0.1:8000/product/${id}`;
}

//view product javascript

function cart(id){

    $.ajax({
            url: 'http://127.0.0.1:8000/api/cart',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            data: JSON.stringify({
                product_id: id,
                quantity: 1,
            }),
            dataType: 'json',
            success: function (data) {
                console.log('API Response:', data);
                    console.log('Success!');
                    var notification = $('#notification');
        notification.css('display', 'block');
        notification.html('Cart saved successfully!');
        setTimeout(function () {
            notification.css('transform', 'translateX(-50%) scale(0)');
            setTimeout(function () {
                notification.css('display', 'none');
                notification.css('transform', 'translateX(-50%) scale(1)');
            }, 500); 
        }, 5000); 
            },
            error: function (error) {
                console.error('AJAX error:', error);
            },
        });
}


function get(source){
    window.location.href = `http://127.0.0.1:8000/product/${source}`;
}


//product buy javascript

if ($('#body3').css('display') === 'block'){
    $('#3').css('background-color', 'white')
}

function product(){
    $('.product_change').css('display', 'block');
    $('.address_change').css('display', 'block');
    $('#item').css('display', 'block');
    $('#address').css('display', '');
    $('#body3').css('display', 'none');
    $('#body2').css('display', 'none');
    $('#card3').css('background-color', 'white');
    $('#card2').css('background-color', 'white');
    $('#order').css('color', 'rgb(154,137,135)').css('width', '158px');
    $('#delivery').css('color', 'rgb(154,137,135)');

    $('#body4').css('display', 'block');
    $('#card4').css('background-color', 'rgb(40,116,240)');
    $('#payment').css('color', 'white');   
    $('#order_check').css('display', '')
    $('#3').css('background-color', 'rgb(240, 240, 240)')
    $('#4').css('background-color', 'white')
} 

function change_order(){
    $('#body4').css('display', 'none');
    $('#card4').css('background-color', 'white');
    $('#payment').css('color', 'rgb(154,137,135)');

    $('.product_change').css('display', 'none');
    $('.address_change').css('display', 'block');
    $('#item').css('display', 'none');
    $('#address').css('display', '');
    $('#body3').css('display', 'block');
    $('#body2').css('display', 'block');
    $('#card3').css('background-color', 'rgb(40,116,240)');
    $('#card2').css('background-color', 'white');
    $('#order').css('color', 'white');
    $('#delivery').css('color', 'rgb(154,137,135)');
    $('#order_check').css('display', 'none')
    $('#3').css('background-color', 'white')
}



function here(){
    $('.address_tab').css('display', 'none');
    $('#add').css('display', 'none');
    $('#card2').css('background-color', 'white');
    $('#delivery').css('color', 'rgb(154,137,135)').css('width', '150px');
    $('#address').css('display', '');
    $('.address_change').css('display', 'block');
    $('#address_check').css('display', '')
    $('#order_check').css('display', 'none')

    $('#item').css('display', 'none');
    $('#body3').css('display', 'block');
    $('#card3').css('background-color', 'rgb(40,116,240)');
    $('#order').css('color', 'white');
    $('#payment').css('color', 'rgb(154,137,135)');
    $('#3').css('background-color', 'white')
    $('#4').css('background-color', 'rgb(240, 240, 240)')
    $('#2').css('background-color', 'rgb(240, 240, 240)')

}

function add_address(){
    $('.full-container').removeClass('d-flex');
    $('.full-container').css('display', 'none');
    $('.add').css('display', 'block');
}

function incrementValue(e) {
        e.preventDefault();
        var fieldName = $(e.target).data('field');
        var parent = $(e.target).closest('div');
        var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal)) {
            parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }

    function decrementValue(e) {
        e.preventDefault();
        var fieldName = $(e.target).data('field');
        var parent = $(e.target).closest('div');
        var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal) && currentVal > 0) {
            parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }

    $('.input-group').on('click', '.button-plus', function(e) {
        incrementValue(e);
    });

    $('.input-group').on('click', '.button-minus', function(e) {
        decrementValue(e);
    });

    function saveAddress() {
    const add_1 = $('#add_1').val();
    const add_2 = $('#add_2').val();
    const add_3 = $('#add_3').val();
    const pin = $('#pin').val();

    const addressData = {
        add_1: add_1,
        add_2: add_2,
        add_3: add_3,
        pin: pin,
    };

    $.ajax({
        url: 'http://127.0.0.1:8000/api/save_add',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json', 
        },
        data: JSON.stringify(addressData), 
        success: function(data){
        console.log('Address saved:', data.message);
        if (data.message === 'success'){
            location.reload();
        }
        
    },
        error: function(error) {
            console.error(error);
        }
    });
}

function place_order(id){
    $.ajax({
        url: 'http://127.0.0.1:8000/product_details/' +id +'/1',
        type: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json', 
        }, 
        success: function(data){
        console.log('Oder placed', data.message);
        if (data.message === 'success'){
            $('.contu').css('display', 'block')
            $('#body4').css('display', 'none')
        }
        
    },
        error: function(error) {
            // Handle error
            console.error(error);
        }
    });
}

//cart page javascript

$(document).ready(function() {
$('.remove-button').on('click', function(){
    var cartitemID = $(this).data('item-id');
    $('#confirmRemoveButton').data('cart-item-id', cartitemID);
    // console.log(cartitemID)
});
});

$(document).ready(function() {
$('#confirmRemoveButton').on('click', function(){
    var cartitemid = $(this).data('cart-item-id');
    // console.log(cartitemid)

    $.ajax({
        url: `api/cart/${cartitemid}`,
        type: 'DELETE',
        headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json', 
        },
        success: function(data){
            if (data.message === 'success'){
                location.reload();
            }
        },
        error: function(error){
            console.log(error)
        }
    });
});
});

function deletecartitem(){

}    

document.addEventListener("DOMContentLoaded", function() {

    var productPrices = document.querySelectorAll(".productPrice");
    
    var totalPrice = 0;
    var totalitem = 0;
    
    productPrices.forEach(function(priceElement) {
        var price = parseFloat(priceElement.textContent.replace("₹", ""));
        totalPrice += price;
        totalitem += 1;
    });
    
    // console.log(totalitem)
    document.getElementById("totalprice").textContent = "₹" + totalPrice.toFixed(2);
    document.getElementById("totalprices").textContent = "₹" + totalPrice.toFixed(2);
    document.getElementById("totalitem").textContent = "Price (" + totalitem+ " items)";
});

function change_address(){
$('.product_change').css('display', 'none');
$('.address_change').css('display', 'none');
$('#item').css('display', 'block');
$('#address').css('display', 'none');
$('#order').css('color', 'rgb(154,137,135)');
$('#payment').css('color', 'rgb(154,137,135)');
$('#item').css('display', 'none');

$('.address_tab').css('display', 'block');
$('#add').css('display', 'block');
$('#card12').css('display', 'none');
$('#delivery').css('color', 'white').css('width', '180px');
$('#address').css('display', 'none');
$('#address2').css('display', 'none');
$('#address_check').css('display', 'none')
$('#3').css('background-color', 'rgb(240, 240, 240)')
$('#4').css('background-color', 'rgb(240, 240, 240)')
$('#2').css('background-color', 'white')
}

function here(){
$('#card12').css('display', 'block');
$('.address_tab').css('display', 'none');
$('#add').css('display', 'none');
$('#card2').css('background-color', 'white');
$('#delivery').css('color', 'black').css('width', '150px');
$('#address').css('display', '');
$('.address_change').css('display', 'block');
$('#address_check').css('display', '')
$('#order_check').css('display', 'none')

$('#item').css('display', 'none');
$('#body3').css('display', 'block');
$('#card3').css('background-color', 'rgb(40,116,240)');
$('#order').css('color', 'white');
$('#payment').css('color', 'rgb(154,137,135)');
$('#3').css('background-color', 'white')
$('#4').css('background-color', 'rgb(240, 240, 240)')
$('#2').css('background-color', 'rgb(240, 240, 240)')

}

function add_address(){
$('.full-container').removeClass('d-flex');
$('.full-container').css('display', 'none');
$('.add').css('display', 'block');
}

