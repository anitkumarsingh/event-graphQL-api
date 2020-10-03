const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const PORT = process.env.PORT || 4000;
const app = express();
const events = [];

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id:ID!
         name:String!
         description:String!
         price:Float!
         createdAt:String
    }
    input EventInput {
       name:String!
       description:String!
       price:Float!
    }
    type rootQuery {
        events:[Event!]!
    }
    type rootMutation {
        createEvent(eventInput:EventInput):Event
    }
      schema {
          query:rootQuery
          mutation:rootMutation
      }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          name: args.eventInput.name,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          createdAt: new Date().toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`server is running ${PORT}`));
