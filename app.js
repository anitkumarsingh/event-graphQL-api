const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const PORT = process.env.PORT || 4000;
const app = express();
const events = ["Coding", "Playing", "Cooking", "Sleeping"];

app.use(bodyParser.json());
app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
    type rootQuery {
        events:[String!]!
    }
    type rootMutation {
        createEvent(name:String):String
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
        const eventName = args.name;
        events.push(eventName);
        return eventName;
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`server is running ${PORT}`));
