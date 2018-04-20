import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo/index';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Form, Message } from 'semantic-ui-react';
import { USER_BY_ID } from '../../../graphql/userQueriesBy';
import { USER_UPDATE_PREFERENCES } from '../../../graphql/userMutations';
/**
 * LIB / MIDDLEWARE
 */
import { _ } from '../../../lib/index';
import { countries_alt } from '../../../lib/Locale/countries';
import { languages_EN } from '../../../lib/Locale/languages';
import { timezones } from '../../../lib/Locale/timezones_custom';
import { setProfile } from '../../../reducers/users/profile/reducer';
import { store } from '../../../store';
import DropdownField from '../../InputForm/DropdownField';
import { Error, Success } from '../../Render';

/**
 * VALIDATOR
 */
const validate = (values, callback) => {
  let errors = {};
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
class Preferences extends React.Component {
  constructor (props) {
    super(props);
    const {profile} = props;
    let initialValues = {
      zones: 'US_WE',
      language: 'en',
      country: 'US',
    };
    if (profile.preferences) initialValues = {
      zones: profile.zones ? profile.zones[0] : process.env.USER_ZONES,
      language: profile.preferences.language ? profile.preferences.language : process.env.USER_LANG,
      country: profile.preferences.country ? profile.preferences.country : process.env.USER_COUNTRY,
      timezone: profile.preferences.timezone ? profile.preferences.timezone : moment.tz.guess() || process.env.USER_TZ,
    };
    this.state = {
      isSubmit: false,
      errorApi: '',
      successApi: '',
      initialValues,
    };
    this.actionSubmit = this.actionSubmit.bind(this);
  }

  componentDidMount () {
    const {initialize} = this.props;
    const {initialValues} = this.state;
    initialize(initialValues);
  }

  actionSubmit (values) {
    const {client, profile} = this.props;
    const {zones, language, country, timezone} = values;
    client.mutate({
      mutation: USER_UPDATE_PREFERENCES,
      variables: {
        user_id: profile.user_id,
        input: {
          language,
          country,
          zones,
          timezone,
        },
      },
      refetchQueries: [{
        query: USER_BY_ID,
        variables: {
          user_id: profile.user_id,
        },
      }],
    }).then(response => {
      if (!response.errors) {
        const payload = response.data['userUpdatePreferences'];
        if (payload) {
          this.setState({
            successApi: 'Your preferences are updated',
            errorApi: '',
          });
          const profileNew = Object.assign({}, profile, {zones: [zones], preferences: {language, country, timezone}});
          store.dispatch(setProfile(profileNew));
        } else {
          this.setState({
            successApi: '',
            errorApi: 'Server Error',
          });
        }
      } else {
        this.setState({
          successApi: '',
          errorApi: 'Server Error',
        });
      }
    });
  }

  render () {
    const {handleSubmit} = this.props;
    const {errorApi, successApi, initialValues} = this.state;
    return (
      <Form onSubmit={handleSubmit((values) => {validate(values, this.actionSubmit);})} error success>
        <h4>Preferences</h4>
        <Message header={'Select your language'}/>
        <Field
          component={DropdownField}
          name="language"
          inputProps={{
            options: languages_EN,
            placeholder: 'Select your language',
            defaultValue: initialValues.language,
          }}
        />
        <Message header={'Select your timezone'}/>
        <Field
          component={DropdownField}
          name="timezone"
          inputProps={{
            options: timezones,
            placeholder: 'Select your timezone',
            defaultValue: initialValues.timezone,
          }}
        />
        <Message header={'Select your country'}/>
        <Field
          component={DropdownField}
          name="country"
          inputProps={{options: countries_alt, placeholder: 'Select your country', defaultValue: initialValues.country}}
        />
        <Message header={'Select the region where your data is stored'}/>
        <Form.Group>
          <Form.Field>
            <label><Field name="zones" component="input" type="radio" value="EU_FR"/> Europe / France</label>
          </Form.Field>
          <Form.Field>
            <label><Field name="zones" component="input" type="radio" value="EU_DE"/> Europe / Deutschland</label>
          </Form.Field>
          <Form.Field>
            <label><Field name="zones" component="input" type="radio" value="US_WE"/> USA / West coast</label>
          </Form.Field>
        </Form.Group>
        <Error header={errorApi}/>
        <Success header={successApi}/>
        <Button primary>Update your preferences</Button>
      </Form>
    );
  }
}

Preferences.propTypes = {
  handleSubmit: PropTypes.func,
  profile: PropTypes.object,
  client: PropTypes.object,
};

export default reduxForm({
  form: 'userDashboard',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withApollo(Preferences));

