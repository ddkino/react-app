/**
 * Created by dd on 10/05/17.
 */
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import FormFooter from '../ChaForm/FormFooter';
import renderField from '../InputForm/Field';
import { finalSubmit, validate } from './Submit';

const RegisterPage1 = (props) => {
  const {handleSubmit, callbackSuccess, graphql} = props;
  return (
    <Form onSubmit={handleSubmit((values) => finalSubmit(values, graphql, callbackSuccess))}>
      <h1>Register step 1/2</h1>
      <Form.Field>
        <Field
          name="email"
          type="text"
          component={renderField}
          label="Email"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="username_alt"
          type="text"
          component={renderField}
          label="Your pseudo (optional)"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
        />
      </Form.Field>
      <Form.Field>
        <Field
          name="passwordCopy"
          type="password"
          component={renderField}
          label="Password (re-type)"
        />
      </Form.Field>
      <FormFooter {...props} disabledBtns={['btnPrev']}/>
    </Form>
  );
};

RegisterPage1.propTypes = {
  handleSubmit: PropTypes.func,
  callbackSuccess: PropTypes.func,
  nextPage: PropTypes.func,
  graphql: PropTypes.object,
};

export default reduxForm({
  form: 'register',
  validate,
  // asyncValidate,
  initialValues: {email: 'dede.user1.gege@yopmail.com', password: '123456', passwordCopy: '123456', username: 'dede.user1'},
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(RegisterPage1);
