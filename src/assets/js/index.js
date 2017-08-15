var app = new Vue({
    el: '#app',
    data: {
        newsletter: {
            email: "",
            status: "waiting",
            signup: function () {
                console.log(this.newsletter.email)
            }
        },
        events: null,
        blogPosts: null
    },
    methods: {
        getDateDay: function (date) {
            return moment(date).format("DD");
        },
        getDateMonth: function (date) {
            return moment(date).format("MMM");
        },
        isSingleDayEvent: function (event) {
            return moment(event.start.dateTime).isSame(moment(event.end.dateTime), "day");
        },
        getDateClock: function (date) {
            return moment(date).format("HH:mm");
        },
        getDateDateAndClock: function (date) {
            return moment(date).format("DD MMM HH:mm");
        }
    },
    mounted: function () {
        var CALENDAR_ID = "g86lrthmecu19gh7arvcj76f08@group.calendar.google.com";
        var GOOGLE_CALENDAR_API_KEY = "AIzaSyATtCseJ8dZJaJ7XsLTIXfCbfpYOseGgHM";
        this.$http.get("https://content.googleapis.com/calendar/v3/calendars/" + CALENDAR_ID + "/events", {
            params: {
                maxResults: 3,
                orderBy: "startTime",
                singleEvents: true,
                timeMin: new Date(Date.now()).toISOString(),
                key: GOOGLE_CALENDAR_API_KEY
            }
        }).then(function (response) {
            this.events = response.body.items;
        });
        this.$http.get("https://blog.ituk.ee/ghost/api/v1.5.0/posts", {
            params: {
                limit: 3
            }
        }).then(function (response) {
            this.blogPosts = response.body.posts;
        });
    }
});

