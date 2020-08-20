const ManagementClient = require("auth0").ManagementClient
const { readFileSync } = require("fs")
require("dotenv").config()

const dir = "deploy/Auth0"

function addOrUpdateHook(management, hookData, triggerId) {
  management.getHooks(function (err, hooks) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    const hook = hooks.find(h => h.name == hookData.name)
    if (hook) {
      console.log("updating hook " + hookData.name)

      management.updateHook({ id: hook.id }, hookData, function (err, _) {
        if (err) {
          console.log(err)
          process.exit(1)
        }
        console.log("updated hook " + hookData.name)
      })
    } else {
      console.log("adding hook " + hookData.name)

      hookData.triggerId = triggerId
      management.createHook(hookData, function (err, _) {
        if (err) {
          console.log(err)
          process.exit(1)
        }
        console.log("added hook " + hookData.name)
      })
    }
  })
}

function addOrUpdateRule(management, ruleData, stage) {
  management.getRules(function (err, rules) {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    const rule = rules.find(r => r.name == ruleData.name)
    if (rule) {
      console.log("updating rule " + ruleData.name)

      management.updateRule({ id: rule.id }, ruleData, function (err, _) {
        if (err) {
          console.log(err)
          process.exit(1)
        }
        console.log("updated rule " + ruleData.name)
      })
    } else {
      console.log("adding rule " + ruleData.name)
      ruleData.stage = "login_success"
      management.createRule(ruleData, function (err, _) {
        if (err) {
          console.log(err)
          process.exit(1)
        }
        console.log("added rule " + hookData.name)
      })
    }
  })
}

var config = JSON.parse(readFileSync(dir + "/config.json", "utf8"))

var management = new ManagementClient({
  domain: config.AUTH0_DOMAIN,
  clientId: config.AUTH0_CLIENT_ID,
  clientSecret: config.AUTH0_CLIENT_SECRET
})

var add_user_hook = readFileSync(dir + "/hooks/" + "add-user-to-slash-graphql.js", "utf8")
add_user_hook = add_user_hook.replace(/<<your-M2M-hook>>/g, config.M2M_API.M2M_authorizationHook)
add_user_hook = add_user_hook.replace(/<<your-client-id>>/g, config.M2M_API.M2M_clientID)
add_user_hook = add_user_hook.replace(/<<your-client-secret>>/g, config.M2M_API.M2M_clientSecret)
add_user_hook = add_user_hook.replace(/<<your-M2M-audience-id>>/g, config.M2M_API.M2M_authAudience)
add_user_hook = add_user_hook.replace(/<<your-Slash-GraphQL-URL>>/g, process.env.REACT_APP_SLASH_GRAPHQL_ENDPOINT + "/graphql")

var add_user_hook_data = {
  name: "add-user-to-slash-graphql",
  script: add_user_hook,
  enabled: true,
}
addOrUpdateHook(management, add_user_hook_data, "post-user-registration")

var authorize_add_hook = readFileSync(dir + "/hooks/" + "authorize-add-user-to-slash-graphql.js", "utf8")
var authorize_add_hook_data = {
  name: "authorize-add-user-to-slash-graphql",
  script: authorize_add_hook,
  enabled: true,
}
addOrUpdateHook(management, authorize_add_hook_data, "credentials-exchange")

var add_username_rule = readFileSync(dir + "/rules/" + "add-username.js", "utf8")
var add_username_rule_data = {
  "name": "add-username",
  "enabled": true,
  "script": add_username_rule,
  "order": 1
}
addOrUpdateRule(management, add_username_rule_data)

management.getClients(function (err, clients) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  const m2m = clients.find(c => c.name == "Authorize M2M for Slash GraphQL")
  if(!m2m) {
    var m2mClient = JSON.parse(readFileSync(dir + "/clients/" + "authorize-m2m-for-slash-graphql.json", "utf8"))
    management.createClient(m2mClient, function (err, createdM2MClient) {
      if (err) {
        console.log(err)
        process.exit(1)
      }
      console.log("created application \"Authorize M2M for Slash GraphQL\"")
      
      const grantData = {
        "client_id": createdM2MClient.client_id,
        "audience": "https://" + config.AUTH0_DOMAIN + "/api/v2/",
        "scope": [ "create:users" ]
      }
      management.clientGrants.create(grantData, function (err) {
        if (err) {
          console.log(err)
          process.exit(1)
        }
      
        console.log("created M2M grant for application \"Authorize M2M for Slash GraphQL\"")
      });
    });
  }else {
    console.log("application \"Authorize M2M for Slash GraphQL\" already exists")
  }

  const spa = clients.find(c => c.name == "Todo")
  if(!spa) {
    var spaData = JSON.parse(readFileSync(dir + "/clients/" + "Todo.json", "utf8"))
    management.createClient(spaData, function (err) {
      if (err) {
        console.log(err)
        process.exit(1)
      }
      console.log("created application \"Todo\"")
    });
  } else {
    console.log("application \"Todo\" already exists")
  }
});