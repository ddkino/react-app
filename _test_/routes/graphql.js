// @flow

import koaPlayground from 'graphql-playground-middleware-koa';
import koaRouter from 'koa-router';
import winston from 'winston';

import schema from '../data';

/**
 * models for couponing with mongoose
 */
import Offer from '../couponing/offer/model'

import {
  AUTH_FORCE_EMAIL,
  GRAPHQL_ENDPOINT,
  GRAPHQL_PLAYGROUND_ENDPOINT,
} from '../constants';

import {
  createGraphqlKoa
} from '../data/modules';

const graphqlRouter = new koaRouter();

let forceEmail;
if (process.env.NODE_ENV === 'development' && AUTH_FORCE_EMAIL != null) {
  forceEmail = AUTH_FORCE_EMAIL;
  winston.info(`Force authenticated user to ${AUTH_FORCE_EMAIL}`);
}
/**
 * rename args with context and add models
 */
const context = {
  forceEmail,
  schema,
  models: {
    Offer
  }
};
graphqlRouter
  .post(GRAPHQL_ENDPOINT, createGraphqlKoa(context))
  .get(GRAPHQL_ENDPOINT, createGraphqlKoa(context));

if (process.env.NODE_ENV === 'development') {
  graphqlRouter.all(
    GRAPHQL_PLAYGROUND_ENDPOINT,
    koaPlayground({
      endpoint: GRAPHQL_ENDPOINT
    }),
  );
}

export default graphqlRouter;