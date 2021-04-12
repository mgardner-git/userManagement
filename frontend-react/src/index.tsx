import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, gql, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:8000/graphql',
});

client
.query({
  query: gql`
      query Users {
          users {
              id
              username
          }
      }
  `
})
.then(result => console.log('GraphQL Query Result', result));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
