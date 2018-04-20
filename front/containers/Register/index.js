import localforage from 'localforage';
import moment from 'moment/moment';
/**
 * Created by dd on 29/05/17.
 */
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withApollo } from 'react-apollo/index';
import _T from '../../lib/Tools';
/**
 * LOCAL
 */
import { initProfile } from '../../reducers/users/profile/reducer';
import Page1 from '../../components/Register/Page1';
import PageFinal from '../../components/Register/PageFinal';

@connect(
  // state
  state => ({}),
  // actions
  dispatch => ({
    actions: {
      initProfile: bindActionCreators(initProfile, dispatch),
    },
  }))
class RegisterContainer extends React.Component {
  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func),
    client: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.callbackSuccess = this.callbackSuccess.bind(this);
    this.state = {
      page: 1,
    };
  }

  nextPage () {
    this.setState({page: this.state.page + 1});
  }

  previousPage () {
    this.setState({page: this.state.page - 1});
  }

  callbackSuccess (result, values) {
    const data = result.data.userRegister;
    _T.log(result.data.userRegister, 'callbackSuccess');
    let expiresAt = _T.expiresAt(process.env.NODE_ENV);
    if (data.expiresAt)
      expiresAt = data.expiresAt;
    // dispatch profile
    Promise.all([
      this.setState(values),
      this.props.actions.initProfile({...data, expiresAt, contacts: undefined}),
    ]).then(() => {

      // page final
      this.nextPage();
    });
  }

  render () {
    const {page, username, email} = this.state;
    return (
      <div>
        {page === 1 &&
        <Page1 callbackSuccess={this.callbackSuccess} nextPage={this.nextPage} page={page}
               graphql={this.props.client}/>}
        {page === 2 &&
        <PageFinal username={username} email={email} graphql={this.props.client}/>}
      </div>
    );
  }
}

export default withApollo(RegisterContainer);