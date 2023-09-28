import express from "express";
import controllers from "../controllers/graphql";
import { graphqlHTTP } from "express-graphql";

const router = express.Router();

router.all(
	"/",
	graphqlHTTP({
		schema: controllers.schema,
		rootValue: controllers.root,
		graphiql: true,
	})
);

export default router;
