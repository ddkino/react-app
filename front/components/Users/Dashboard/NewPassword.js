import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo/index';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Form, Button } from 'semantic-ui-react';

/**
 * LIB / MIDDLEWARE
 */
import _ from 'lodash';
import { USER_UPDATE_PASSWORD } from '../../../graphql/userMutations';
import _T from '../../../lib/Tools';
import _V from '../../../lib/Validator';
import { Error, Success } from '../../Render';
import RenderField from '../../InputForm/Field';

/**
 * VALIDATOR
 */
const validate = (values, callback) => {
  // _T.log(values);
  const {password_current, password_new_test, password_new} = values;
  let errors = {};
  if (_.isEmpty(password_current)) {
    errors.password_current = 'error password';
  }
  if (_V.isPassword(password_current) == -2) {
    errors.password_current = 'too short 6 characters mini';
  }
  if (_.isEmpty(password_new)) {
    errors.password_new = 'error password';
  }
  if (_V.isPassword(password_new) == -2) {
    errors.password_new = 'too short 6 characters mini';
  }
  if (password_new !== password_new_test) {
    errors.password_new_test = 'Your new password is not the same';
  }
  if (!_.isEmpty(errors)) {
    throw new SubmissionError({
      ...errors,
    });
  } else {
    callback(values);
    throw new SubmissionError({});
  }
};

@connect(state => ({
  profile: state.profile,
}))
class NewPassword extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isSubmit: false,
      errorApi: '',
    };
    this.actionSubmit = this.actionSubmit.bind(this);
  }

  actionSubmit (values) {
    const {client, profile, reset} = this.props;
    reset();
    client.mutate({
      mutation: USER_UPDATE_PASSWORD,
      variables: {
        user_id: profile.user_id,
        password_current: values.password_current,
        password_new: values.password_new,
      },
    }).then(response => {
      if (!response.errors) {
        const payload = response.data['userUpdatePassword'];
        if (payload) {
          this.setState({
            successApi: 'Your password is updated',
          });
        }
      } else {
        const errCode = response.errors[0].state[0].key;
        switch (errCode) {
          case 'PASSWORD_USERID_NOT_AUTH':
            this.setState({
              errorApi: 'User not authentified',
            });
            break;
          case 'PASSWORD_FAILED':
          default:
            this.setState({
              errorApi: 'Current password is invalid',
            });
        }
      }
    });
  }

  render () {
    const {handleSubmit} = this.props;
    const {errorApi} = this.state;
    return (
      <Form onSubmit={handleSubmit((values) => {validate(values, this.actionSubmit);})} error success>
        <h4>Change password</h4>
        <Form.Field>
          <Field
            name="password_current"
            component={RenderField}
            type="password"
            placeholder="your current password"
            label="Current password"
          />
        </Form.Field>
        <Form.Field>
          <Field
            name="password_new"
            component={RenderField}
            type="password"
            placeholder="NEW password"
            label="NEW password (6 charracters mini)"
          />
        </Form.Field>
        <Form.Field>
          <Field
            name="password_new_test"
            component={RenderField}
            type="password"
            placeholder="Retype your NEW password"
            label="Retype your NEW password"
          />
        </Form.Field>
        <Error header={errorApi}/>
        <Success header={errorApi}/>
        <Button primary>Modify your password</Button>
      </Form>
    );
  }
}

NewPassword.propTypes = {
  handleSubmit: PropTypes.func,
  profile: PropTypes.object,
  client: PropTypes.object,
};

export default reduxForm({
  form: 'userDashboard',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withApollo(NewPassword));

