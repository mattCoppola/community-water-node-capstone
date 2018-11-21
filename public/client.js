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

/////////// SIGNUP FORM ///////////
$('.signup-form').submit(function (e) {
    e.preventDefault();
    const username = $('#signup-username').val();
    const password = $('#signup-password').val();
    const confirmPW = $('#confirm-password').val();

    if (password !== confirmPW) {
        alert('Passwords must match!');
    } else if (username == "") {
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
        $('#confirm-password').val('');
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
//Capture user input on Add Results Form //
///////////////////////////////////////////
$('.results-form').submit(function (e) {
    e.preventDefault();
    const firstDraw = $('#first-draw').val();
    const threeMinute = $('#three-minute').val();
    const fiveMinute = $('#five-minute').val();

    if (![firstDraw, threeMinute, fiveMinute].every(Number)) {
        alert("Entries must be a number");
    } else {
        const results = {
            firstDraw: firstDraw,
            threeMinute: threeMinute,
            fiveMinute: fiveMinute
        };

        console.log('results', results);

        $('#first-draw').val('');
        $('#three-minute').val('');
        $('#five-minute').val('');
    };
});

///////////////////////////////////////////
//Capture user input on Update Results Form //
///////////////////////////////////////////
$('.update-form').submit(function (e) {
    e.preventDefault();
    const firstDraw = $('#first-draw-update').val();
    const threeMinute = $('#three-minute-update').val();
    const fiveMinute = $('#five-minute-update').val();

    if (![firstDraw, threeMinute, fiveMinute].every(Number)) {
        alert("Entries must be a number");
    } else {
        const updateResults = {
            firstDraw: firstDraw,
            threeMinute: threeMinute,
            fiveMinute: fiveMinute
        }

        console.log('updateResults:', updateResults);

        $('#first-draw-update').val('');
        $('#three-minute-update').val('');
        $('#five-minute-update').val('');
    };
});

///////////////////////////////////////////
//on.click Button Scroll to next Section //
///////////////////////////////////////////

$('.scroll').on('click', function (e) {
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

$('.add-results').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    showResultsModal();
});

$('.results-close').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeResultsModal();
});

$('.update-results').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    showUpdateModal();
});

$('.update-close').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeUpdateModal();
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

function showResultsModal() {
    $('#enter-results').css('display', 'block');
}

function closeResultsModal() {
    $('#enter-results').css('display', 'none');
}

function showUpdateModal() {
    $('#update-results').css('display', 'block');
}

function closeUpdateModal() {
    $('#update-results').css('display', 'none');
}


///////////////////////////////////////
//Mapbox                             //
///////////////////////////////////////

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGNvcHBvbGEiLCJhIjoiY2ptb3ZsdmFuMTh1YTNrbWowa3gzZm82ZiJ9.S7EhnqCwmFeZmy-obXH41g';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9'
});
