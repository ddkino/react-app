/**
 * Created by dd on 29/05/17.
 */
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import FormFooter from '../ChaForm/FormFooter';
import renderField from '../../components/InputForm/Field';
import _V from '../../lib/Validator';

const validate = (values) => {
  let errors = {};
  if (_V.isUsername(values.username) < 0) {
    errors.username = 'your username is Not valid';
  }
  return errors;
};

// todo put password here
const RegisterPage2 = (props) => {
  const {handleSubmit} = props;
  return null;
};

RegisterPage2.propTypes = {
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'register',
  validate,
  // asyncValidate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(RegisterPage2);