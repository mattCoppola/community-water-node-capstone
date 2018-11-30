// Set Global Variables
let TOKEN;
let loggedInUserName;

//////////////////
// On Page Load //
//////////////////
$(function () {
    $('.hide-everything').hide();
    $('#landing-page').show();
    //    showResults();
})


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

        $.ajax({
                type: 'POST',
                url: '/api/auth/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                TOKEN = result.authToken;
                loggedInUserName = username;
                // hide home, landing pages, close login form, display user dashboard
                $('#login').hide();
                $('#home').hide();
                $('#landing-page').hide();
                $('#user-dashboard').show();
                $('.no-map').hide();
                $('.main-nav li').removeClass('responsive');
                populateUserDashboard(loggedInUserName);
                addressGeo(username);
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
    // Take the input from the user
    const username = $('#signup-username').val();
    const password = $('#signup-password').val();
    const confirmPW = $('#confirm-password').val();
    // Reset user input
    $('#signup-username').val('');
    $('#signup-password').val('');
    $('#confirm-password').val('');

    // Validate input
    if (password !== confirmPW) {
        alert('Passwords must match!');
    } else if (username == "") {
        alert('Please input a user name.');
    } else if (password == "") {
        alert('Please input a password.');
    } else {
        const newUserObject = {
            username: username,
            password: password
        };
        console.log(newUserObject);

        $.ajax({
                type: 'POST',
                url: '/api/users',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            .done(function (result) {
                $('#signup').hide();
                $.ajax({
                        type: 'POST',
                        url: '/api/auth/login',
                        dataType: 'json',
                        data: JSON.stringify(newUserObject),
                        contentType: 'application/json'
                    })
                    .done(function (result) {
                        TOKEN = result.authToken;
                        loggedInUserName = username;
                        // hide home, landing pages, close login form, display user dashboard
                        $('#login').hide();
                        $('#home').hide();
                        $('#landing-page').hide();
                        $('#map').hide();
                        $('.no-map').show();
                        $('#user-dashboard').show();
                        $('.main-nav li').removeClass('responsive');
                        populateUserDashboard(loggedInUserName);
                    })
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                    });

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert("Username is already taken. Choose another username.")
            });
    };
});

///////////////////////////////////////////
//Capture user input on Add Results Form //
///////////////////////////////////////////
$('.results-form form').submit(function (e) {
    e.preventDefault();
    const street = $('#street').val();
    const city = $('#city').val();
    const state = $('#state').val();
    const zip = $('#zip').val();

    const firstDraw = $('#first-draw').val();
    const threeMinute = $('#three-minute').val();
    const fiveMinute = $('#five-minute').val();

    // reset user input
    $('#street').val('');
    $('#city').val('');
    $('#state').val('');
    $('#zip').val('');
    $('#first-draw').val('');
    $('#three-minute').val('');
    $('#five-minute').val('');

    if (![firstDraw, threeMinute, fiveMinute].every(Number)) {
        alert("Entries must be a number");
    } else {
        const results = {
            street: street,
            city: city,
            state: state,
            zip: zip,
            firstDraw: firstDraw,
            threeMinute: threeMinute,
            fiveMinute: fiveMinute
        };


        console.log('results', results);
        const token = ("bearer " + TOKEN);

        $.ajax({
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token)
                },
                url: '/api/results',
                dataType: 'json',
                data: JSON.stringify(results),
                contentType: 'application/json'
            })
            .done(function (created) {
                console.log(created);
                // hide enter-results form
                $('#enter-results').hide();
                $('#map').show();
                $('.no-map').hide();
                populateUserDashboard(loggedInUserName);
                addressGeo(loggedInUserName);

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

//////////////////////////////////////////////
//Capture user input on Update Results Form //
//////////////////////////////////////////////
$('.update-form form').submit(function (e) {
    e.preventDefault();
    const street = $('#street-update').val();
    const city = $('#city-update').val();
    const state = $('#state-update').val();
    const zip = $('#zip-update').val();
    const entryID = $('.inputEntryId').val();

    const firstDraw = $('#first-draw-update').val();
    const threeMinute = $('#three-minute-update').val();
    const fiveMinute = $('#five-minute-update').val();

    // reset user update input
    $('#street-update').val('');
    $('#city-update').val('');
    $('#state-update').val('');
    $('#zip-update').val('');
    $('#first-draw-update').val('');
    $('#three-minute-update').val('');
    $('#five-minute-update').val('');

    if (![firstDraw, threeMinute, fiveMinute].every(Number)) {
        alert("Entries must be a number");
    } else {
        const updateResults = {
            street: street,
            city: city,
            state: state,
            zip: zip,
            firstDraw: firstDraw,
            threeMinute: threeMinute,
            fiveMinute: fiveMinute,
            entryID: entryID
        };

        console.log('updateResults:', updateResults);
        const token = ("bearer " + TOKEN);

        $.ajax({
                type: 'PUT',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token)
                },
                url: `/api/update-results/${entryID}`,
                dataType: 'json',
                data: JSON.stringify(updateResults),
                contentType: 'application/json'
            })
            .done(function () {
                // hide enter-results form
                $('#update-results').hide();
                populateUserDashboard(loggedInUserName);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };
});

//////////////////////////////////////
//Delete user's most recent results //
//////////////////////////////////////

$('.delete-form button').on('click', function (e) {
    e.preventDefault();
    const token = ("bearer " + TOKEN);
    const deleteId = $('.recent-id').val();
    console.log(deleteId);

    if (deleteId) {
        $.ajax({
                type: 'DELETE',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', token)
                },
                url: `/api/delete-results/${deleteId}`,
                //            dataType: 'json',
                //            data: JSON.stringify(deleteId),
                contentType: 'application/json'
            })
            .done(function () {
                $('#delete-results').hide();
                populateUserDashboard(loggedInUserName);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    } else {
        $('#delete-results').hide();
        alert("There are no Results to Delete!  Add some results.");
    }
});



////////////////////////////
//Populate User Dashboard //
////////////////////////////

function populateUserDashboard(username) {
    const token = ("bearer " + TOKEN);
    const userObject = {
        user: username
    };

    $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            url: `/api/results/${username}`,
            dataType: 'json',
            data: JSON.stringify(userObject),
            contentType: 'application/json'
        })
        .done(function (resultsOutput) {
            console.log(resultsOutput);

            let userInfo = userInfoCard(resultsOutput);
            resultsReview(resultsOutput);
            $('.username').text(username);
            $('.address').text(userInfo.address);
            $('.resultAverage').text(userInfo.resultsAvg);
            $('.lastUpdated').text(userInfo.lastUpdated);
            $('.display-user').text(username);

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function userInfoCard(resultsOutput) {
    console.log(resultsOutput);
    let userInfo = {
        address: '-',
        resultsAvg: '-',
        lastUpdated: '-'
    };
    if (resultsOutput.resultsOutput.length > 0) {
        let info = resultsOutput.resultsOutput;
        let date = new Date(info[info.length - 1].testResults.created)
        userInfo = {
            address: info[info.length - 1].address.street,
            // this is currently hardcoded in - need to make average function
            resultsAvg: userResultsAverage(resultsOutput),
            //            lastUpdated: info[info.length - 1].testResults.created
            lastUpdated: date.toDateString()
        }

    };
    return userInfo;
};

function userResultsAverage(resultsOutput) {
    if (resultsOutput.resultsOutput.length > 0) {
        let resultEntries = resultsOutput.resultsOutput;
        let totalEntries = [
            resultEntries[resultEntries.length - 1].testResults.firstDraw,
            resultEntries[resultEntries.length - 1].testResults.threeMinute,
            resultEntries[resultEntries.length - 1].testResults.fiveMinute
    ];
        const resultsAvg = totalEntries.reduce((a, b) => a + b, 0) / totalEntries.length;
        $('.recent-id').val(resultEntries[resultEntries.length - 1]._id);
        return resultsAvg.toFixed(2);
    } else {
        return;
    }

};

function resultsReview(resultsOutput) {
    if (resultsOutput.resultsOutput.length > 0) {
        let resultsAvg = userResultsAverage(resultsOutput)
        if (resultsAvg >= 1) {
            $('.red-results').show();
            $('.green-results').hide();
        } else {
            $('.green-results').show();
            $('.red-results').hide();
        }
        $('.user-landing').hide();
    } else {
        return;
    }
};

////////////////////////////////
//Populate Update Results Form//
////////////////////////////////
$('.update-results').on('click', function (e) {
    e.preventDefault();
    populateUpdateResultsForm(loggedInUserName);
    const entryIdCheck = $('.inputEntryId').val();
});

function populateUpdateResultsForm(username) {
    const token = ("bearer " + TOKEN);
    const userObject = {
        user: username
    };

    $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            url: `/api/results/${username}`,
            dataType: 'json',
            data: JSON.stringify(userObject),
            contentType: 'application/json'
        })
        .done(function (resultsOutput) {
            if (resultsOutput.resultsOutput.length > 0) {
                let resultEntries = resultsOutput.resultsOutput;
                let totalEntries = [
                resultEntries[resultEntries.length - 1].testResults.firstDraw,
                resultEntries[resultEntries.length - 1].testResults.threeMinute,
                resultEntries[resultEntries.length - 1].testResults.fiveMinute
            ];

                let street = resultEntries[resultEntries.length - 1].address.street;
                let city = resultEntries[resultEntries.length - 1].address.city;
                let state = resultEntries[resultEntries.length - 1].address.state;
                let zip = resultEntries[resultEntries.length - 1].address.zip;
                let entryId = resultEntries[resultEntries.length - 1]._id;

                $('#first-draw-update').val(totalEntries[0]);
                $('#three-minute-update').val(totalEntries[1]);
                $('#five-minute-update').val(totalEntries[2]);
                $('#street-update').val(street);
                $('#city-update').val(city);
                $('#state-update').val(state);
                $('#zip-update').val(zip);
                $('.inputEntryId').val(entryId);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};



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

///////////////////////////////////////////
//on.click Explore our Map button        //
///////////////////////////////////////////

$('.explore').on('click', function (e) {
    e.preventDefault();
    showSignupModal();
});

///////////////////////////////////////
//Modal Functions and jQuery Actions //
///////////////////////////////////////

// If user has not yet registered
$('#change-form-signup').click(function (e) {
    e.preventDefault();
    closeLoginModal();
    showSignupModal();
});

// If user is already a registered user
$('#change-form-login').click(function (e) {
    e.preventDefault();
    closeSignupModal();
    showLoginModal();
});


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

$('.delete-results').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    showDeleteModal();
});

$('.delete-close').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeDeleteModal();
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

function showDeleteModal() {
    $('#delete-results').css('display', 'block');
}

function closeDeleteModal() {
    $('#delete-results').css('display', 'none');
}

///////////////////////////////////////
//User Dashboard jQuery              //
///////////////////////////////////////

$('.back-home').on('click', function (e) {
    e.preventDefault();
    $('#home').show();
    $('#landing-page').show();
    $('#user-dashboard').hide();
    $('.main-nav li').removeClass('responsive');
})

$('.logout').on('click', function (e) {
    e.preventDefault();
    location.reload();
});

///////////////////////////////////////
//Show Results (green or red)        //
///////////////////////////////////////

function showResults() {
    if (resultsAverage < .99) {
        $('.green-results').show();
    } else {
        $('.red-results').show();
    }
    $('.user-landing').hide();
};

////////////////////////////
//MapQuest                //
////////////////////////////

const KEY = 'GiYuJwNn1HxU23kCdvgJwbmsIg75N3gW';
L.mapquest.key = KEY;

// 'map' refers to a <div> element with the ID map
let map = L.mapquest.map('map', {
    center: [41.8781, -87.6298],
    layers: L.mapquest.tileLayer('map'),
    zoom: 10
});

function addMarker(lat, lng) {
    L.marker([lat, lng]).addTo(map);
}

///////////////////////////////////
// Call to Mapquest for Geocodes //
///////////////////////////////////

function addressGeo(username) {
    const token = ("bearer " + TOKEN);
    const userObject = {
        user: username
    };

    $.ajax({
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token)
            },
            url: `/api/seed-data/${username}`,
            dataType: 'json',
            data: JSON.stringify(userObject),
            contentType: 'application/json'
        })
        .done(function (resultsOutput) {
            let addresses = resultsOutput.resultsOutput;
            let address = addresses.map(address => address.address);

            for (let key of address) {
                let addr = Object.values(key).toString();
                getGeoData(displayResultsOnMap, addr);
            }

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function getGeoData(callback, address) {
    let URL = 'http://www.mapquestapi.com/geocoding/v1/address?key=GiYuJwNn1HxU23kCdvgJwbmsIg75N3gW'
    let query = {
        location: address,
        maxResults: '5'
    }

    $.getJSON(URL, query, function () {
            console.log('geocode testing...');
        })
        .done(callback)
        .fail(function () {
            console.log('error');
        })
        .always(function () {
            console.log('geocode testing complete.')
        });
};

function displayResultsOnMap(data) {
    let latLng = data.results[0].locations[0].latLng;
    let lat = latLng.lat;
    let lng = latLng.lng;

    console.log(latLng);
    addMarker(lat, lng);
};
