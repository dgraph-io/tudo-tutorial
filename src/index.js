import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client"
import { setContext } from '@apollo/client/link/context';
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"

const AuthorizedApolloProvider = ({ children }) => {
  const { isAuthenticated, getIdTokenClaims } = useAuth0()

  const httpLink = createHttpLink({
    uri: "https://exotic-screw.us-west-2.aws.cloud.dgraph.io/graphql",
  })

  const authLink = setContext(async (_, { headers }) => {

    if (!isAuthenticated) {
      return { headers }
    }

    const token = await getIdTokenClaims()

    console.log(token)

    return {
      headers: {
        ...headers,
        Authorization: token ? token.__raw : "",
      },
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

ReactDOM.render(
  <Auth0Provider
    domain="dev-x44cgu-8.auth0.com"
    clientId="uP8THzorNFP5aBDAgaYht3uA7hMtZacY"
    redirectUri={window.location.origin}
  >
    <AuthorizedApolloProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthorizedApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
)
