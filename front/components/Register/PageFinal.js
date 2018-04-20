/**
 * Created by dd on 31/05/17.
 */
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { Icon, Step } from 'semantic-ui-react';
import { Success } from '../../components/Render';

class RegisterPageFinal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

  render () {
    const {username, email} = this.props;
    const {redirect} = this.state;
    if (redirect) {
      return <Redirect push to="/profile/avatar"/>;
    }
    return (
      <React.Fragment>
        <Success header={`Congrats ${username} your account is created`} icon={'checkmark'}/>
        <Step.Group fluid>
          <Step>
            <Icon name='mail outline'/>
            <Step.Content>
              <Step.Title>An email was sent to : <strong>{email}</strong></Step.Title>
              Confirm your registration
            </Step.Content>
          </Step>
          <Step active onClick={() => {this.setState({redirect: true});}}>
            <Icon name='address card outline'/>
            <Step.Content>
              <Step.Title>Create your avatar, modify your language, country ...</Step.Title>
            </Step.Content>
          </Step>
        </Step.Group>
      </React.Fragment>
    );
  };
}

RegisterPageFinal.propTypes = {
  username: PropTypes.string,
  email: PropTypes.string,
};

export default reduxForm({
  form: 'register',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(RegisterPageFinal);