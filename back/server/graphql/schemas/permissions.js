import ValidationError from '../../lib/commons/ValidationError';

const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context) => {
      await resolver(parent, args, context);
      return childResolver(parent, args, context);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
  if (context.env === 'development') return;
  try {
    if (!context.session.user_id || context.session.user_id !== args.user_id) {
      throw new ValidationError([{key: 'PRE_AUTH_FAILED', message: `${context}`}]);
    }
  } catch (err) {
    throw new ValidationError([{key: 'PRE_AUTH_ERR', message: `${err}`}]);
  }
});

/**
 * Auth + Owner
 */
export const requiresOwner = requiresAuth.createResolver((parent, args, context) => {
  if (context.env === 'development') return;
  try {
    if (context.session.user_id !== String(args.a_id)) {
      throw new ValidationError([{key: 'PRE_OWNER_FAILED', message: `${context}`}]);
    }
  } catch (err) {
    throw new ValidationError([{key: 'PRE_OWNER_ERR', message: `${err}`}]);
  }
});

/**
 * Auth + Admin role
 */
export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
  if (context.env === 'development') return;
  try {
    if (!context.session.role === 'admin') {
      throw new ValidationError([{key: 'PRE_ADMIN_FAILED', message: `${context}`}]);
    }
  } catch (err) {
    throw new ValidationError([{key: 'PRE_ADMIN_ERR', message: `${err}`}]);
  }
});
