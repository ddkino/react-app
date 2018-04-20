import localforage from 'localforage';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Form, Message } from 'semantic-ui-react';
import renderField from '../../components/InputForm/Field';
import { CHA_BY_OWNERID } from '../../graphql/chaQueriesBy';
/**
 * LOCAL
 */
import { USER_LOGIN } from '../../graphql/userQueriesLogin';
import { _T, _V } from '../../lib';
import { setCha } from '../../reducers/cha/reducer';
import { setContacts } from '../../reducers/users/contacts/reducer';
import { initProfile } from '../../reducers/users/profile/reducer';
import { addUsers as addUser } from '../../reducers/users/public/reducer';
import { store } from '../../store';

let initlogin;
if (process.env.NODE_ENV === 'development') {
  initlogin = {login: 'dede.user1', password: '123456'};
} else {
  initlogin = {login: '', password: ''};
}

@connect(
  (state) => ({}),
  dispatch => ({
    actions: {
      setCha: bindActionCreators(setCha, dispatch),
      addUser: bindActionCreators(addUser, dispatch),
    },
  }),
)
class LoginContainer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLogin: false,
      errorApi: '',
      redirectToReferrer: false,
      username: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit (values) {
    const {actions} = this.props;
    const {login, password} = values;
    let method;
    const locale = 'fr-FR';
    const errors = {};
    this.setState({errors});
    // empty fields
    if (!login) {
      throw new SubmissionError({
        login: 'login is missing',
        _error: 'Login failed!',
      });
    }
    if (!password) {
      throw new SubmissionError({
        password: 'password is missing',
        _error: 'Login failed!',
      });
    }

    // select type of login (email, phone, username)
    switch (_V.loginInfo(login)) {
      case 'email':
        if (!_V.isEmail(login)) {
          throw new SubmissionError({
            login: 'Email not valid',
            _error: 'Login failed!',
          });
        }
        method = 'byEmail';
        break;
      case 'phone':
        if (!_V.isMobilePhone(login, locale)) {
          throw new SubmissionError({
            login: 'Phone not valid',
            _error: 'Login failed!',
          });
        }
        method = 'byPhone';
        break;
      case 'username':
      default:
        if (_V.isUsername(login) < 0) {
          throw new SubmissionError({
            login: 'Username not valid',
            _error: 'Login failed!',
          });
        }
        method = 'byUsername';
        break;
    }

    this.props.client.query({
      query: USER_LOGIN,
      variables: {
        login,
        password,
        method,
        locale,
      },
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    })
      .then(result => {
        const payload = result.data.userLogin;
        const errors = result.errors;
        if (!errors) {
          /**
           * LOAD mycha no cache
           */
          this.props.client.query({
            query: CHA_BY_OWNERID,
            variables: {
              userId: payload.user_id,
              withData: true,
              withUser: true,
              withShare: true,
            },
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          }).then(result => {
            const payload = result.data.chaByOwner;
            store.dispatch(setCha(
              payload.map(cha => ({
                id: cha.id,
                c: cha.c,
                h: cha.h,
                a_id: cha.a_id,
                a: cha.user.username,
                share: cha.share,
              })),
            ));
            // todo optimize ? keep ?
            // store.dispatch(addUser({user_id: payload.user_id, username: cha.user.username});
            //   payload.map(cha => ({user_id: cha.a_id, username: cha.user.username})),
            // ));
          });
          // tip for apollo cache
          let expiresAt = _T.expiresAt(process.env.NODE_ENV);
          if (payload.expiresAt)
            expiresAt = payload.expiresAt;

          const contacts = payload.contacts;
          Promise.all([
            localforage.setItem('token', payload.token), // needed for auth graphql
            store.dispatch(initProfile({...payload, expiresAt, contacts: undefined})),
            store.dispatch(setContacts(contacts)),
          ]).then(() => {
            this.setState(() => ({
              isLogin: true,
              username: payload.username,
            }));
            setTimeout(() => this.setState(() => ({
              redirectToReferrer: true,
            })), 500);
          });
        } else {
          const errCode = errors[0].state[0].key;
          _T.log(errors[0].state[0].key, 'data.errors');
          switch (errCode) {
            // todo
            case 'LOGIN_BY_USERNAME_FAILED':
            case 'LOGIN_BY_EMAIL_FAILED': {
              this.setState({errorApi: 'User not found'});
              break;
            }
            case 'LOGIN_PASSWORD_FAILED': {
              this.setState({errorApi: 'Check your password'});
              break;
            }
            default: {
              this.setState({errorApi: 'Server error'});
              store.dispatch(initProfile());
            }
          }
        }
      });
  }

  render () {
    const {handleSubmit, error} = this.props;
    const {errorApi, redirectToReferrer, isLogin, username} = this.state;
    const {from} = this.props.location.state || {from: {pathname: `/ch@${username}`}};

    const errorForm = errorApi + (error || '');
    if (isLogin === true) {
      if (redirectToReferrer === true) {
        return (
          <Redirect to={from}/>
        );
      }
      return (
        <Message header={'You are login'}/>
      );
    }
    return (
      <Form onSubmit={handleSubmit(this.handleSubmit)}>
        <Form.Field>
          <Field
            name="login"
            type="text"
            component={renderField}
            label="Email/Username"
            placeholder="Email/Username"
          />
        </Form.Field>
        <Form.Field>
          <Field
            name="password"
            type="text"
            component={renderField}
            label="Password"
          />
        </Form.Field>
        <Form.Field>
          <Button type="submit">Connexion</Button>
          {errorForm && <div className="error-form">{errorForm}</div>}
        </Form.Field>
      </Form>
    );
  }
}

LoginContainer.propTypes = {
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  history: PropTypes.object,
  client: PropTypes.object,
  location: PropTypes.object,
};

LoginContainer.defaultProps = {};

export default reduxForm({
  form: 'login',
  destroyOnUnmount: false,
  initialValues: initlogin,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withApollo(LoginContainer));
