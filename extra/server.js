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

app.post('/', async (req, res) => {
  const receivedValue = req.body;

  try {
    const apiResponsesArray = await fetchProductData(receivedValue);
    res.send(apiResponsesArray);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal server error');
  }
});

async function fetchProductData(receivedValue) {
  const apiResponsesArray = [];
  const { tags } = receivedValue;

  for (let i = 0; i < tags.length; i++) {
    const graphqlQuery = `
      query {
        site {
          search {
            searchProducts(
              filters: {
                searchTerm: "${tags[i].text}"
              }
              sort: A_TO_Z
            ) {
              products {
                edges {
                  node {
                    entityId
                    sku
                    name
                    inventory {
                      aggregated {
                        availableToSell
                        warningLevel
                      }
                      hasVariantInventory
                      isInStock
                    }
                    prices {
                      price {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const data = await graphqlRequest(graphqlQuery);
      apiResponsesArray.push(data);
      console.log('Received API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  return apiResponsesArray;
}

async function graphqlRequest(query) {
  try {
    const response = await axios.post(graphqlEndpoint, {
      query: query
    }, {
      headers: api_headers
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.error('Failed to fetch data from GraphQL endpoint:', response.status);
      console.error(response.data);
      throw new Error('Failed to fetch data from GraphQL endpoint');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


app.use(express.json())
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
