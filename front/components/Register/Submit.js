import { SubmissionError } from 'redux-form';
import _ from 'lodash';
import { USER_REGISTER } from '../../graphql/userMutations';
import Tools from '../../lib/Tools';
import myValidator from '../../lib/Validator';

const finalSubmit = (values, graphql, callbackSuccess) => {
  // Tools.log(values, 'submit ');
  let errors = {};
  let {password, passwordCopy} = values;
  if (!password || !passwordCopy) {
    errors = {
      ...errors,
      passwordCopy: 'password missing', //
    };
    throw new SubmissionError(errors);
  }
  if (myValidator.isPassword(password) < 0) {
    errors = {
      ...errors,
      password: 'password too short', // todo length in config
    };
  }
  if (password !== passwordCopy) {
    errors = {
      ...errors,
      passwordCopy: 'password not the same',
    };
  }
  if (!_.isEmpty(errors)) {
    throw new SubmissionError(errors);
  }
  delete values.passwordCopy;
  console.log(values);

  return graphql.mutate({
    mutation: USER_REGISTER,
    variables: values,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  }).then((data) => {
    if (!data.errors) {
      Tools.log(data, 'response');
      // ok
      callbackSuccess(data, values);
    } else {
      const errCode = data.errors[0].state[0].key;
      Tools.log(errCode, 'err');
      switch (errCode) {
        case 'REGISTER_EMAIL_EXISTS':
          throw new SubmissionError({
            email: 'This email is taken',
          });
        case 'REGISTER_USERNAME_EXISTS':
          throw new SubmissionError({
            username: 'This username is taken',
          });
      }
    }
  });
};

const validate = (values) => {
  let errors = {};
  if (myValidator.isEmail(values.email) < 0) {
    errors.email = 'your email is Not valid';
  }
  if (myValidator.isPassword(values.password) < 0) {
    errors.password = 'your password is Not valid';
  }
  if (myValidator.isUsername(values.username) < 0) {
    errors.username = 'your username is Not valid';
  }
  return errors;
};

export { validate, finalSubmit };