const { readFileSync } = require("fs")
const readlineSync = require("readline-sync")
const { GraphQLClient, gql } = require("graphql-request")
require("dotenv").config()

const updateSchema = gql`
  mutation($schema: String!) {
    updateGQLSchema(input: { set: { schema: $schema } }) {
      gqlSchema {
        schema
      }
    }
  }
`

function createSchema() {
  var schema = readFileSync("deploy/SlashGraphQL/schema.graphql", "utf8")
  var todoRule = readFileSync("deploy/SlashGraphQL/must-own-todo.graphql", "utf8")
  var userRule = readFileSync("deploy/SlashGraphQL/must-be-this-user.graphql", "utf8")

  schema = schema.replace(/must-own-todo/g, '"""' + todoRule + '"""')
  schema = schema.replace(/must-be-this-user/g, '"""' + userRule + '"""')

  var authStr = readFileSync("deploy/SlashGraphQL/auth.json", "utf8")
  var key = readFileSync("deploy/SlashGraphQL/public.key", "utf8")
  var auth = JSON.parse(authStr)
  auth.VerificationKey = key

  return schema + "\n\n# Dgraph.Authorization " + JSON.stringify(auth)
}

async function installSchema() {
  const gqlSchema = createSchema()

  var slashToken = readlineSync.question("Slash GraphQL access token : ", {
    hideEchoBack: true,
  })

  const client = new GraphQLClient(
    process.env.REACT_APP_SLASH_GRAPHQL_ENDPOINT + "/admin",
    { headers: { "X-Auth-Token": slashToken } }
  )

  const { error } = await client.request(updateSchema, { schema: gqlSchema })

  return error
}

installSchema()
  .then((error) => {
    if (error) {
      console.log(error)
    } else {
      console.log(
        `Schema added to Slash GraphQL instance at ` +
          process.env.SLASH_GRAPHQL_ENDPOINT
      )
    }
  })
  .catch((error) => {
    console.log(error)
  })
