var languageStrings = {
    'en': {
        'translation': {
            'WELCOME': "Welcome to Westlake Guide!",
            'HELP': "Say about, to hear more about the city, or say coffee, breakfast, lunch, or dinner, to hear local restaurant suggestions, or say recommend an attraction, or say, go outside. ",
            'ABOUT': "Westlake is an oasis of natural beauty that maintains open spaces in balance with distinctive development, trails, and quality of life amenities amidst an ever expanding urban landscape. Nestled in the DFW Metroplex, Westlake is a Gold Level Scenic City and home to several corporate campuses including Deloitte University, CoreLogic, and Fidelity Investments. ",
            'STOP': "Okay, see you next time in Westlake!"
        }
    }
};

var data = {
    "city": "Westlake",
    "state": "TX",
    "postcode": "76051",
    "restaurants": [{
            "name": "Hollywood Burger",
            "address": "1301 Solana Blvd., The Plaza-Bldg 4, Suite 4116",
            "phone": "682-237-7771",
            "meals": "breakfast, lunch, dinner",
            "web": "http://hollywoodburgertexas.com/",
            "description": "Hollywood Burger is all about full flavor and fresh ingredients. The creators of the Hollywood Burger’s menu are Mr. and Mrs. Song. They have owned and operated restaurants for 30 years. The Songs have cornered the flavor people are craving! The blend of awesome ingredients, perfect seasonings, and specific technique bring together many sorts of dishes. The Korean Wraps and BBQ are unforgettable. The Bulgogi Burger will show you a flavor so full and satisfying you it will raise the bar on burgers."
        },
        {
            "name": "La Scala Pizzeria",
            "address": "1301 Solana Blvd., The Plaza-Bldg 4, Suite 4115",
            "phone": "817-491-3779",
            "meals": "lunch, dinner",
            "web": "https://lascalapizza.com/",
            "description": "Authentic New York style Italian Restaurant."
        },
        {
            "name": "Mar-Cosina Tex Mex",
            "address": "1301 Solana Blvd., The Plaza-Bldg 4, Suite 4108",
            "phone": "817-490-6115",
            "meals": "breakfast, lunch, dinner",
            "web": "http://www.marcosina.com/",
            "description": "Come experience the flavors of Tex-Mex to Gourmet, located in Solana-Westlake."
        },
        {
            "name": "SGR (Solana Great Room) inside the Marriott Solana Hotel",
            "address": "1301 Solana Blvd., Building 3",
            "phone": "817-430-5000",
            "meals": "coffee, breakfast, lunch, dinner",
            "web": "http://www.marriott.com/hotels/hotel-information/restaurant/dalwl-dallas-fort-worth-marriott-solana/",
            "description": "Enjoy our upbeat modern décor for breakfast lunch and dinner in SGR, Solana Greatroom restaurant in Westlake, featuring all your favorites served with a local Texas flare. Open for breakfast, lunch and dinner; Dress code: Casual We also have a Starbucks®Coffee House - Enjoy your favorite Starbucks specialty and regular coffee beverages served daily at our Westlake hotel."
        }
    ],
    "attractions": [{
            "name": "Glynwyck Park",
            "description": "The park at Glenwyck Farms is 13.5 acres of open space with a variety of 60 feet oak and pecan trees.  The park, which opens at dawn and closes at dusk, is maintained by The Town of Westlake and the Home Owner's Association of Glenwyck Farms. The park is located at 1601 Fair Oaks Drive, and includes a running brook, three rustic bridges, and a paved walking path. Oak and pecan trees, some of which tower 60 feet, decorate the lush area.",
            "distance": "0"
        },
        {
            "name": "Westlake Photo Gallery",
            "description": "Westlake Citizens treasure local events that give them the opportunity for fellowship with friends and neighbors. This photo album captures many Westlake events over the years, as well as Westlake's unique and beautiful scenery. Special thanks to Jaymi and Nicholas Ford, who have provided a large portion of the photographs on our website for your viewing enjoyment.Additionally, we appreciate the talents and sharing of photos from Sherry Lewis, Allen Heath, Troy Crow, and many others.",
            "distance": "2"
        },
        {
            "name": "Westlake Trails Map & Guide",
            "description": "Westlake has more than 10 miles of public/private connected trails for you to enjoy and staff is pleased to announce that we now have a map to show you where the trails are located. The Westlake Trails Map & Guide includes a color coded legend that shows four trails: Dove-Davis, Solana, Granada and Glenwyck and identifies the locations of trail heads with parking, pedestrian underpasses, shade structures, drinking fountains, and those historical markers located along the trails. We hope you enjoy exploring our community's oasis of natural beauty and miles of scenic trails. Now let's all get out and walk Westlake!",
            "distance": "4"
        }
    ]
}

// Weather courtesy of the Yahoo Weather API.
// This free API recommends no more than 2000 calls per day

var myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET'
};

// 2. Skill Code =======================================================================================================

var Alexa = require('alexa-sdk');

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var say = this.t('WELCOME') + ' ' + this.t('HELP');
        this.emit(':ask', say, say);
    },

    'AboutIntent': function () {
        this.emit(':tell', this.t('ABOUT'));
    },

    'CoffeeIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('coffee'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'For a great coffee shop, I recommend, ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'BreakfastIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('breakfast'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'For breakfast, try this, ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'LunchIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('lunch'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'Lunch time! Here is a good spot. ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'DinnerIntent': function () {
        var restaurant = randomArrayElement(getRestaurantsByMeal('dinner'));
        this.attributes['restaurant'] = restaurant.name;

        var say = 'Enjoy dinner at, ' + restaurant.name + '. Would you like to hear more?';
        this.emit(':ask', say);
    },

    'AMAZON.YesIntent': function () {
        var restaurantName = this.attributes['restaurant'];
        var restaurantDetails = getRestaurantByName(restaurantName);

        var say = restaurantDetails.name +
            ' is located at ' + restaurantDetails.address +
            ', the phone number is ' + restaurantDetails.phone +
            ', and the description is, ' + restaurantDetails.description +
            '  I have sent these details to the Alexa App on your phone.  Enjoy your meal! <say-as interpret-as="interjection">bon appetit</say-as>';

        var card = restaurantDetails.name + '\n' + restaurantDetails.address + '\n' +
            data.city + ', ' + data.state + ' ' + data.postcode +
            '\nphone: ' + restaurantDetails.phone + '\n';

        this.emit(':tellWithCard', say, restaurantDetails.name, card);

    },

    'AttractionIntent': function () {
        var distance = 200;
        if (this.event.request.intent.slots.distance.value) {
            distance = this.event.request.intent.slots.distance.value;
        }

        var attraction = randomArrayElement(getAttractionsByDistance(distance));

        var say = 'Try ' +
            attraction.name + ', which is ' +
            (attraction.distance == "0" ? 'right downtown. ' : attraction.distance + ' miles away. Have fun! ') +
            attraction.description;

        this.emit(':tell', say);
    },

    'GoOutIntent': function () {

        getWeather((localTime, currentTemp, currentCondition) => {
            // time format 10:34 PM
            // currentTemp 72
            // currentCondition, e.g.  Sunny, Breezy, Thunderstorms, Showers, Rain, Partly Cloudy, Mostly Cloudy, Mostly Sunny

            // sample API URL for Irvine, CA
            // https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22irvine%2C%20ca%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

            this.emit(':tell', 'It is ' + localTime +
                ' and the weather in ' + data.city +
                ' is ' +
                currentTemp + ' and ' + currentCondition);

            // TODO
            // Decide, based on current time and weather conditions,
            // whether to go out to a local beach or park;
            // or recommend a movie theatre; or recommend staying home


        });
    },

    'AMAZON.NoIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', this.t('HELP'));
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP'));
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function getRestaurantsByMeal(mealtype) {

    var list = [];
    for (var i = 0; i < data.restaurants.length; i++) {

        if (data.restaurants[i].meals.search(mealtype) > -1) {
            list.push(data.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {

    var restaurant = {};
    for (var i = 0; i < data.restaurants.length; i++) {

        if (data.restaurants[i].name == restaurantName) {
            restaurant = data.restaurants[i];
        }
    }
    return restaurant;
}

function getAttractionsByDistance(maxDistance) {

    var list = [];

    for (var i = 0; i < data.attractions.length; i++) {

        if (parseInt(data.attractions[i].distance) <= maxDistance) {
            list.push(data.attractions[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    var https = require('https');


    var req = https.request(myAPI, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            var channelObj = JSON.parse(returnData).query.results.channel;

            var localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            var currentTemp = channelObj.item.condition.temp;

            var currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);

        });

    });
    req.end();
}

function randomArrayElement(array) {
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}
