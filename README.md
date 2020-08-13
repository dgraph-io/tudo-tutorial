# Todo React App powered by Slash GraphQL

Todo React App using GraphQL build by Dgraph Labs and powered by [Slash GraphQL](https://dgraph.io/slash-graphql).

![Todo App Screenshot](./SlashGraphQLTodos.png)

This repo contains a number of versions of the app.

If you are just getting started with Slash GraphQL, you might want to start with the the branch `get-started-blog` in this repo and this blog post (coming soon).

If you are here to learn about deploying a multi-user app with Slash GraphQL that has built in auth, with an Auth0 login, deployed to Netlify, then check out this blog (coming soon) on the Auth0 blog site.

You can also head over to our [docs](https://graphql.dgraph.io/) to get started.

## Starting the App

```
npm install
npm start
```

You'll first need to set the url in `src/index.js` to the Slash GraphQL backend that you deploy.  See the instructions in the blog to get started.

## Dependencies

The UI is vanilla React JS with Apollo client, and the neat [React-TodoMVC](https://github.com/sw-yx/react-todomvc) component.