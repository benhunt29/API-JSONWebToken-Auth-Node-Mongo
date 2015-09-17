var $loginForm;
var $eventsDiv;
var $registerForm;
var $user;
var $error;
var $content;
var $logout;
var $rememberMe;
var $networkingEventForm;
var source;

$(document).ready(function () {
    source = $('#eventTemplate').html();

    $loginForm = $('#login');
    $eventsDiv = $('#showEvents');
    $registerForm = $('#register');
    $error = $('#error');
    $content = $('#content');
    $logout = $('#logout');
    $user = $('#user');
    $rememberMe = $('#rememberMe');
    $networkingEventForm = $('#networkingEventForm');

    $networkingEventForm.hide();
    console.log(localStorage.getItem('userToken'));

    setupAjax();
    console.log(localStorage.getItem('userToken'));

    bindEvents();
    console.log(localStorage.getItem('userToken'));

    showUser();
    console.log(localStorage.getItem('userToken'));

    showEventsForm();

});

function displayEvents(events){
    var template = Handlebars.compile(source);
    console.log(events);
    $('#networkingEvents').append(template(events,{"events":events}));
}

function showUser() {
    if (sessionStorage.getItem('userProfile')) {
        console.log('showusersession');
        var user = JSON.parse(sessionStorage.getItem('userProfile'));
        $loginForm.hide();
        $user.text('You are currently logged in as ' + user.username);
        $content.text('');
    } else if(localStorage.getItem('userProfile')) {
        var user = JSON.parse(localStorage.getItem('userProfile'));
        $loginForm.hide();
        $user.text('You are currently logged in as ' + user.username);
        $content.text('');
    }

}

function showEventsForm() {

    if (sessionStorage.getItem('userProfile')) {
        console.log('showing session');
        $networkingEventForm.show();
    } else if(localStorage.getItem('userProfile')) {
        console.log('showing local');
        $networkingEventForm.show();
    }
}

function hideUser() {
    if (sessionStorage.getItem('userToken')) {
        sessionStorage.removeItem('userToken');
    }

    if (sessionStorage.getItem('userProfile')) {
        sessionStorage.removeItem('userProfile');
    }

    if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
    }

    if (localStorage.getItem('userProfile')) {
        localStorage.removeItem('userProfile');
    }

    $loginForm.show();
    $user.text('');
    $content.text('');
}

function setupAjax() {
    $.ajaxSetup({
        'beforeSend': function (xhr) {
            if (sessionStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + sessionStorage.getItem('userToken'));
            } else if (localStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + localStorage.getItem('userToken'));
            }
        }
    });
}

function bindEvents() {

    // set up the API test
    $eventsDiv.on('click', function (e) {
        $.ajax('/api/networkingEvent/all', {
            method: 'get'
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area
            displayEvents(data);

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // on a failure, put that in the content area
            $content.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // set up login
    $loginForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/authenticate', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //save token in local storage if user checks remember me box
            if ($rememberMe.prop('checked')){
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userProfile', JSON.stringify(data.user));
            }
            //save token in session storage
            sessionStorage.setItem('userToken', data.token);

            // Set the user
            sessionStorage.setItem('userProfile', JSON.stringify(data.user));

            // clear form
            $loginForm[0].reset();

            showUser();
            showEventsForm();
            setupAjax();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            $error.text(jqXHR.responseText);
        }).always(function () {
            console.log("complete");
        });
    });

    // set up register
    $registerForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/register', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //redirect back home, so that they can log in
            window.location.replace('/');

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // show the user the error
            $error.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // set up register
    $networkingEventForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/api/networkingEvent', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //redirect back home, so that they can log in
            window.location.replace('/');

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // show the user the error
            $error.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    $logout.on('click', function () {
        hideUser();
        $networkingEventForm.hide();
    })
}