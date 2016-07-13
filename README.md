# Location Augmented Reality Program Interaction API (LARPI)
The design of LARPI project is to build a server which provides an Ingress-like API for building Augmented Reality experiences, available to users from a hosted web page or an app. Developers should be able to build their own Augmented Reality interaction points within the system. All the components are Javascript native.
____
## Component Definition
* Interactions: An interaction is a physically anchored location which provides users an opportunity to interact with the server or each other
* Inventory: A list of virtual assets
* Server API: REST Server running on node.js+express which holds the data via MongoDB and answers calls on asynchronous endpoints, all data should be compressed, multiple instance capable for load balanced distribution, secured via token authentication created via Passportjs
* Client Interface: An HTML5+js web service which shows the user game interface

The Augmented Reality API should track:
* User authentication to create token (through social networks or email login)
* User acquisition to create the user
* User billing for subscriptions (Authorize.net)
* User billing for in game purchases (Authorize.net)
* User’s location, and from the location derive: a list of important interactions which are nearby, and a list of nearby users
* User’s inventory, allowing purchases, possibly a system for trading among users
* A User is involved in an interaction with another user or with a game interaction point

### API Important Points
* Only one interaction is possible at a time.
* Many users might be participating in a single interaction.
* Some interactions have user limits
* Client and Server modules for interactions need to be created for each type of interaction being portrayed

## Client Interface:
The Client Interface is built in HTML5+js, using three.js to access the webGL display systems on mobile and desktop clients. It should be buildable through a generic build system, in this case Cordova.

A JSON based config file is used to initialize the WebGL rendered components. Page appearance is adjustable through the modification of a scss (SASS) file which globally adjusts the theme and appearance of the displayed pages, which should also be generated from the JSON appearance config.

#### Client Interface Pages
* World Map - An overview showing the player and the interactions which are in range
* Player - Tabbed interface Shows Player stats, inventory
* Interaction - An interface showing the details of the current interaction. Trade, Fight, Charm, Steal are all interaction types which might be used. Developers build the interaction interfaces for each type.

### Admin Interface
* World Map An overview showing heat levels for activity
* Edit Interaction - Create an interaction point from existing interaction modules
* Dashboard - Show the current state of the server and any warnings

## API Endpoints
GET
/ Fetches web root view, includes user interface

POST
/[version]/location sends current location data
/[version]/login Logs in the user (oauth)
/[version]/[interaction][?users] Sends interaction activity

Socket.io emit:
/[version]/me User current data (including user interaction data)
/[version]/[interaction] Interacts with interaction point, possibly with other users
