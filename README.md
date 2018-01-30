# MBTA Departure Board
[Deployed app](https://stormy-ridge-48421.herokuapp.com/)

## About the app

This app gets real time MBTA departure data in a csv format and displays it on a webpage in human-readable form. It checks for new data and refreshes every 5 seconds. It tells the user when the data was last updated using the timestamp from the csv file.

## Technologies Used

I made this as a Django and React app because that's what I'm most familiar with at the moment. In hindsight, I might just do a frontend React app, because Django seems like overkill here, and there's a bit of a lag on getting the data. I originally went with Django because I thought using Python to deal with the CSV would be more straightforward than doing it in JavaScript.

## Shortcomings

If I were doing a real production app, I would want frontend testing to be sure that everything works as intended. I ran into a couple of cases where testing would have been helpful, including the one in which there are no trains currently running, which is easiest to simulate using a test.

The other thing that I think needs work is the lag; the info is about 7 seconds out of date when it arrives. I'm not sure how often the CSV updates, so I haven't fully diagnosed this problem.

Design could likely be improved as well.


