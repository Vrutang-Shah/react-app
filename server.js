const express = require('express');
const app = express();
var request = require('request');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const { error } = require('jquery');
const graphqlEndpoint = 'https://store-6rdwu4oyoo.mybigcommerce.com/graphql';
const api_headers = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOltdLCJlYXQiOjE4ODU2MzUxNzYsImlhdCI6MTcwNTk5NTA0NCwiaXNzIjoiQkMiLCJzaWQiOjEwMDIzNjUzODcsInN1YiI6IjF6Mm5mamNtYWtndXFueHdpZnhzN3Y4N203OGFqaGkiLCJzdWJfdHlwZSI6MiwidG9rZW5fdHlwZSI6MX0.U04nT7ZpqihiwekTz4XV8h08hF0o7gmwW0U4nPCnBEuBlRBq-hAxzUisvaUkwhyeeyB_bSJFB_md0QWneGFYwg'
};

app.use(cors());
app.use(bodyParser.json());

const graphqlQuery = `
query MyFirstQuery {
  site {
    settings {
      storeName
    }
    products {
      edges {
        node {
          entityId
          name
          sku
          prices {
            retailPrice {
              value
              currencyCode
            }
            price {
              value
              currencyCode
            }
          }
        }
      }
    }
  }
}
`;

function productFetch() {
  app.get('/', async (req, res) => {
    try {
      const response = await fetch(graphqlEndpoint, {
        method: "POST",
        headers: api_headers,
        body: JSON.stringify({ query: graphqlQuery }),
      });
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(response.status).json({ error: 'Failed to fetch data from GraphQL endpoint' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
productFetch();

app.use(express.json())
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
