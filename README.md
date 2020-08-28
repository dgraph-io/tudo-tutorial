# Todo React App powered by Slash GraphQL

Todo React App using GraphQL build by Dgraph Labs and powered by [Slash GraphQL](https://dgraph.io/slash-graphql).

![Todo App Screenshot](./SlashGraphQLTodos.png)

This app is a multi-user Slash GraphQL app that has built in auth, through an [Auth0](https://auth0.com/) login, and deployed to [Netlify](https://www.netlify.com/).  There's an accompanying blog post (coming soon) on the Auth0 blog site that walks you through creating an app like this one.

This repo contains a number of versions of the app --- if you are just getting started with Slash GraphQL, you might want to start with the the branch `get-started-blog` and this [blog post](https://dgraph.io/blog/post/todo-slash-graphql/).

You can also head over to our [docs](https://dgraph.io/docs/graphql/overview/) to read other getting started guides and tutorials.

## Starting the App

FIXME

```
npm install
npm start
```

You'll first need to set the url in `src/index.js` to the Slash GraphQL backend that you deploy.  See the instructions in the blog to get started.

## Dependencies

The UI is vanilla React JS with Apollo client, and the neat [React-TodoMVC](https://github.com/sw-yx/react-todomvc) component.