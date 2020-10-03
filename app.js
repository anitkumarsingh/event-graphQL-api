const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Events = require("./models/Events");

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
        return Events.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            throw erro;
          });
      },
      createEvent: (args) => {
        const event = new Events({
          name: args.eventInput.name,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          createdAt: new Date().toISOString(),
          updatedAt: Date.now(),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      },
    },
    graphiql: true,
  })
);
mongoose
  .connect("mongodb://127.0.0.1:27017/companies", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("Connected to mongodb://127.0.0.1:27017/companies");
    app.listen(PORT, () => console.log(`server is running ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
