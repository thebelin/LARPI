####Location Augmented Reality Program Interaction API (LARPI)####

The design of LARPI project is to build a server which provides an Ingress-like (Pokemon Go) API for building Augmented Reality experiences, available to users from a hosted web page or an app. Developers should be able to build their own Augmented Reality interaction points and customize map appearance within the system. All the components are Javascript native.

##Component Definition##
* Interactions: An interaction is a physically anchored location which provides users an opportunity to interact with the server or each other
* Inventory: A list of virtual assets
* Server API: REST Server running on node.js+express which holds the data via MongoDB and answers calls on asynchronous endpoints, all data should be compressed, multiple instance capable for load balanced distribution, secured via token authentication created via Passportjs
* Client Interface: An HTML5 + js web service which shows the user game interface

The Augmented Reality API should track:
* User authentication to create token (through social networks or email login)
* User acquisition to create the user
* User billing for subscriptions (Authorize.net)
* User billing for in game purchases (Authorize.net)
* User’s location, and from the location derive: a list of important interactions which are nearby, and a list of nearby users
* User’s inventory, allowing purchases, possibly a system for trading among users
* A User is involved in an interaction with another user or with a game interaction point

API Important Points
* Only one interaction is possible at a time.
* Many users might be participating in a single interaction.
* Some interactions have user limits
* Client and Server modules for interactions need to be created for each type of interaction being portrayed
____

###Client Interface:###
The Client Interface is built in HTML5+js, using three.js to access the webGL display systems on mobile and desktop clients. It should be buildable through a generic build system, in this case Cordova. The custom map interface is provided through the Google javascript API

A JSON based config file is used to initialize the WebGL rendered components. Page appearance is adjustable through the modification of a scss (SASS) file which globally adjusts the theme and appearance of the displayed pages, which should also be generated from the JSON appearance config.

Client Interface Pages
* World Map - An overview showing the player and the interactions which are in range, use Google's javascript map customization API to configure the interface.
* Player - Tabbed interface Shows Player stats, inventory, level management, history
* Interaction - An interface showing the details of the current interaction. Trade, Fight, Charm, Steal are all interaction types which might be used. Developers build the interaction interfaces for each type.
____

##API Endpoints##
####GET####
* / Fetches web root view, includes user interface

####POST####
* /[version]/location sends current location data
* /[version]/login Logs in the user (oauth)
* /[version]/[interaction][?users] Sends interaction activity about interaction point and the user ids which were part of it

####Socket.io emit:####
* /[version]/me User current data (including user interaction data and history)
* /[version]/[interaction] Interacts with interaction point, possibly with other users

##Admin API Endpoints##
####GET####
* /admin/ Admin root view
* /[version]/admin/interaction Gets interactions in paged format

####POST####
* /[version]/admin/login Logs in User by obtaining access token
* /[version]/admin/interaction/ Creates new interaction
* /[version]/admin/activity Send data with location to watch activity

####PUT####
* /[version]/admin/interaction/[interactionid] Updates the interaction

####Socket.io emit:####
* /[version]/admin/activity Update activity according to current profile
