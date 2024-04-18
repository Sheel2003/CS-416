$(document).ready(function () {
    // Set to store unique event names
    let uniqueEvents = new Set();

    $('button').click(function () {
        let searchTerm = $('[name="search_term"]').val();
        let location = $('[name="location"]').val();

        // Check for empty search term
        if (!searchTerm.trim()) {

            $('#emptySearchAlert').show();
            $('#emptyCityAlert').hide();
            $('.alert.alert-light').hide();
            return;
        }

        // Check for empty city
        if (!location.trim()) {
            // Show the alert for empty city
            $('#emptyCityAlert').show();
            $('#emptySearchAlert').hide();
            $('.alert.alert-light').hide();
            return;
        }

        $('#emptySearchAlert').hide();
        $('#emptyCityAlert').hide();

        let apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=US";
        apiUrl += "&apikey=gid7U4Sa5eyRpYYLZQ7NoXMxMRau66qd";

        $.ajax({
            type: "GET",
            url: apiUrl,
            async: true,
            dataType: "json",
            data: {'keyword': searchTerm, 'city': location, 'sort': 'date,asc'},

            success: function (json) {
                $('#results').empty();
                uniqueEvents.clear();

                if (!$.isEmptyObject(json._embedded) && json._embedded.events.length > 0) {
                    const returnedResult = json._embedded.events.length + " results found";
                    console.log(returnedResult);
                    $('#search-result').html(returnedResult);

                    $.each(json._embedded.events, function (i, item) {
                        const eventName = item.name;


                        if (!uniqueEvents.has(eventName)) {
                            const eventLink = item.url;
                            const imgURL = item.images[1].url;
                            const eventDate = item.dates.start.dateTime;
                            const venueName = item._embedded.venues[0].name;
                            const address = item._embedded.venues[0].address.line1;
                            const city = item._embedded.venues[0].city.name;
                            const zipcode = item._embedded.venues[0].postalCode;
                            const venueState = item._embedded.venues[0].state.name;
                            const venueCityState = city + ', ' + venueState;

                            const formattedDate = formatDate(eventDate);
                            const formattedTime = formatTime(eventDate);

                            function formatDate(date) {
                                const options = {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'};
                                return new Date(date).toLocaleDateString('en-US', options);
                            }
                            function formatTime(date) {
                                const options = {hour: 'numeric', minute: 'numeric', hour12: true};
                                return new Date(date).toLocaleTimeString('en-US', options);
                            }

                            // append response into the page for each unique event
                            $('#results').append(`
                                <div class="card mb-3">
                                    <div class="row g-0 align-items-center">
                                        <div class="col-sm-4">
                                            <img src="${imgURL}" alt="event_img" class="card-img rounded p-1 img-fluid" id="event-img">
                                        </div>
                                        <div class="col-sm-8">
                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-sm-8">
                                                        <h1 class="card-title display-5" id="event-title">${eventName}</h1>
                                                    </div>
                                                    <div class="col-sm-4 text-end">
                                                        <small class="fs-2 text-success " id="date">${formattedDate}</small><br>
                                                        <small class="fw-light fs-5 text-success" id="time">${formattedTime}</small>
                                                    </div>
                                                </div>
                                                <p class="card-text text-muted display-6" id="venue-name">${venueName}</p>
                                                <p class="card-text text-muted" id="address">${address}<br>${venueCityState}</p>
                                                <div class="col-4-sm">
                                                    <a class="btn bt?n-primary" href="${eventLink}" id="event-url" role="button" target="_blank">Find Tickets</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `);

                            uniqueEvents.add(eventName);
                        }
                    });
                } else {
                    console.log("No results were found");
                    $('.alert.alert-light').html("No results were found!").removeClass('alert-light').addClass('alert-light').show();
                }
            },
            error: function (xhr, status, err) {
            }
        });
    });

});
