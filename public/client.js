///////////////////////////////////////////
//on.click Button Scroll to next Section //
///////////////////////////////////////////

$('.btn').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
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
