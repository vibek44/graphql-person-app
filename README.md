-graphql is an alternative to rest api in a sense that graphql construct query to extract required information between client and server.
-like restapi, graphql doesnot need to use different interfaces to retrieve different data that are requested using various request method.for example, graphql uses same interfaces with POST method for request to retrieve various required data only.
Apollo-server<->graphql server
-this project was about creating graphql app server.
-graphql app server is created using apollo-server.
-created server is then fed to startStandAloneServer which is then connected to frontend side.
-schemas or graphql object are created and corresponding resolver for query and mutation is created.
