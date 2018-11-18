/////////////////////////////////////////
//Capture user input on Signup or Login//
/////////////////////////////////////////

/////////// LOGIN FORM ///////////
$('.login-form').submit(function (e) {
    e.preventDefault();
    const username = $('#login-username').val();
    const password = $('#login-password').val();

    if (username == "") {
        alert('Please input a user name.');
    } else if (password == "") {
        alert('Please input a password.');
    } else {
        const loginUserObject = {
            username: username,
            password: password
        };
        $('#login-username').val('');
        $('#login-password').val('');
        console.log(loginUserObject);

        $.ajax({
                type: 'GET',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                console.log(result);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

/////////// SIGNUP FORM ///////////
$('.signup-form').submit(function (e) {
    e.preventDefault();
    const username = $('#signup-username').val();
    const password = $('#signup-password').val();

    if (username == "") {
        alert('Please input a user name.');
    } else if (password == "") {
        alert('Please input a password.');
    } else {
        const loginUserObject = {
            username: username,
            password: password
        };
        $('#signup-username').val('');
        $('#signup-password').val('');
        console.log(loginUserObject);

        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                console.log(result);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});


///////////////////////////////////////////
//on.click Button Scroll to next Section //
///////////////////////////////////////////

$('.btn').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
});


///////////////////////////////////////////
//on.click Hamburger Icon                //
///////////////////////////////////////////

$('.fa-bars').on('click', function (e) {
    e.preventDefault();
    $('.main-nav li').toggleClass('responsive');
});

///////////////////////////////////////
//Modal Functions and jQuery Actions //
///////////////////////////////////////

$('.login').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    showLoginModal();
});

$('.login-close').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeLoginModal();
});

$('.signup').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    showSignupModal();
});

$('.signup-close').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeSignupModal();
});

function showLoginModal() {
    $('#login').css('display', 'block');
}

function closeLoginModal() {
    $('#login').css('display', 'none');
}

function showSignupModal() {
    $('#signup').css('display', 'block');
}

function closeSignupModal() {
    $('#signup').css('display', 'none');
}


///////////////////////////////////////
//Mapbox                             //
///////////////////////////////////////

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGNvcHBvbGEiLCJhIjoiY2ptb3ZsdmFuMTh1YTNrbWowa3gzZm82ZiJ9.S7EhnqCwmFeZmy-obXH41g';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9'
});
