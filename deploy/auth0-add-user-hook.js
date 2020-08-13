/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/

// Example of an Auth0 hook that's run on Auth0 "Post User Registration".
// After Auth0 has processed the user registration flow and added the user
// to its user data base for the app (there's lots of ways to set this up),
// it calls this hook which then adds the user to the Dgraph graph - the user
// is needed there, so we can link the user to their todos.  (Another way to
// set it up would have been to keep the user details only in auth0 and just
// tag the todos with a 'username', but we may want more user data in the Dgraph
// graph, so we also create a user object there.)

module.exports = function (user, context, cb) {
  var { request } = require("graphql-request")

  // Fill these values with your Dgraph GraphQL instances.
  const dgraphURL =
    "https://urbane-powder-1224.us-west-2.aws.cloud.dgraph.io/graphql"

  console.log("Hi mum")

  request(
    dgraphURL,
    `mutation($name:String!) {
        addUser(input:[ 
        { 
            username: $name, 
            todos: [
                {value: "Get a Slash GraphQL account", completed: true},
                {value: "Deploy a GraphQL backend", completed: true},
                {value: "Build a React app", completed: false},
                {value: "Learn more GraphQL", completed: false}
            ]
        }
        ]) {
            user {
                username
            }
        }
    }`,
    { name: user.email }
  ).then((data, err) => {
    console.log(data)
    cb(err, null)
  })
}
