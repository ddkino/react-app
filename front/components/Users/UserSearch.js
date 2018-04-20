import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Icon, Search } from 'semantic-ui-react';
import { CONTACT_ADD } from '../../graphql/contactMutations';
import { USER_SEARCH_BY_USERNAME } from '../../graphql/userQueriesBy';
import { _, _T } from '../../lib';
import { addContacts } from '../../reducers/users/contacts/reducer';
import { addUsers, toggleInitUsers, toggleUsers } from '../../reducers/users/public/reducer';
import { usersSelector } from '../../selectors/usersSelector';

@connect(
  state => ({
    usersSelected: usersSelector(state),
    profile: state.profile,
    contacts: state.contacts.data,
  }),
  dispatch => ({
    actions: {
      users: {
        toggleInit: bindActionCreators(toggleInitUsers, dispatch),
        toggle: bindActionCreators(toggleUsers, dispatch),
        add: bindActionCreators(addUsers, dispatch),
      },
      contacts: {
        add: bindActionCreators(addContacts, dispatch),
      },
    },
  }),
)
class UserSearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchResultSelect = this.handleSearchResultSelect.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
  }

  handleSearchChange (e, {value}) {
    console.log(value);
    const {client, contacts, profile, actions} = this.props;
    client.query({
      query: USER_SEARCH_BY_USERNAME,
      variables: {
        username: value,
      },
      fetchPolicy: 'network-only',
    }).then(response => {
      _T.log(response);
      const payload = response.data.userSearchByUsername;
      if (_.isEmpty(payload)) return;
      // add users in store
      actions.users.add(payload);
      // filter contacts
      const contactIds = contacts.map(v => v.user_id);
      const payloadSorted = _.sortBy(payload, ['username']);

      this.setState({
        resultsSearchUsers:
          payloadSorted
            .filter(v => {
              return contactIds.indexOf(v.user_id) < 0 && v.user_id !== profile.user_id;
            })
            .map(v => ({
              title: '@' + v.username + (v.username_alt.length > 0 ? ' / ' + v.username_alt : ''),
              image: v.avatar_filename,
              user_id: v.user_id,
            })),
      });
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.resultsSearchUsers !== this.state.resultsSearchUsers) return true;
    return false;
  }

  handleSearchResultSelect (e, {result}) {
    const {actions} = this.props;
    // mo multi select
    actions.users.toggleInit();
    actions.users.toggle(result.user_id);
  }


  handleAddUser () {
    const {client, profile, usersSelected, actions} = this.props;
    const {resultsSearchUsers} = this.state;
    actions.contacts.add(usersSelected);
    console.log(Object.values(usersSelected.map(v => v.user_id)));

    client.mutate({
      mutation: CONTACT_ADD,
      variables: {
        user_id: profile.user_id,
        contact_ids: Object.values(usersSelected.map(v => v.user_id)),
      },
      refetchQueries: [],
    }).then(response => {
      console.log(response);
      if (!response.errors) {

      }
    });
  }

  render () {
    const {inputProps, onClick} = this.props;
    const {resultsSearchUsers} = this.state;
    console.log('render search users');
    return (
      <Form>
        <Search
          icon={'add'}
          input={{
            id: 'userSearchForm',
            fluid: true,
            icon: <Icon name='add' inverted circular link onClick={this.handleAddUser}/>,
          }}
          loading={false}
          onResultSelect={this.handleSearchResultSelect}
          onSearchChange={this.handleSearchChange}
          results={resultsSearchUsers}
          // value={value}
          // source={contactsDropdown}
          noResultsMessage={''}
          showNoResults={true}
          {...inputProps}
        />
      </Form>
    );
  }
}

UserSearch.propTypes = {
  contacts: PropTypes.array,
  profile: PropTypes.object,
  inputProps: PropTypes.object,
  onClick: PropTypes.func,
};
export default withApollo(UserSearch);
