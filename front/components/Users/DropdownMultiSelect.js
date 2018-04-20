import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react';
import { toggleContacts, toggleInitContacts } from '../../reducers/users/contacts/reducer';
import { toggleInitUsers, toggleUsers } from '../../reducers/users/public/reducer';

@connect(
  state => ({}),
  dispatch => ({
    actions: {
      users: {
        toggleInit: bindActionCreators(toggleInitUsers, dispatch),
        toggleInit: bindActionCreators(toggleUsers, dispatch),
      },
      contacts: {
        toggleInit: bindActionCreators(toggleContacts, dispatch),
        toggleInit: bindActionCreators(toggleInitContacts, dispatch),
      },
    },
  }),
)
class UsersMultiSelect extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      multiple: true,
      search: true,
      searchQuery: null,
      valueList: props.valueInit || [],
    };
    props.actions[props.reducer].toggleInit();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (e, {value}) {
    const {actions, reducer} = this.props;
    actions[reducer].toggleInit(value);
  }

  componentDidMount () {
    if (this.state.valueList) {
      this.setState({loading: false});
    }
  }

  /**
   * OK checked
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate (nextProps, nextState) {
    const {loading} = this.state;
    const {optionsList} = this.props;
    if (nextState.loading !== loading) return true;
    if (nextProps.optionsList !== optionsList) return true;
    return false;
  }

  render () {
    const {loading} = this.state;
    const {optionsList, labels, input, handleChange} = this.props;
    return (
      <React.Fragment>
        <h4>{labels.title}</h4>
        <Dropdown placeholder={labels.placeholder}
                  multiple
                  fluid search selection
                  loading={loading}
                  options={optionsList}
                  onChange={handleChange}
                  {...input}/>
      </React.Fragment>
    );
  }
}

//
UsersMultiSelect.propTypes = {
  optionsList: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  valueInit: PropTypes.array,
  labels: PropTypes.object,
  input: PropTypes.object,
  reducer: PropTypes.string,
};

UsersMultiSelect.defaultProps = {
  labels: {title: 'For share (module)', placeholder: ''},
  valueInit: [],
  optionsList: [],
  handleChange: function () {},
  reducer: 'contacts',
};

export default UsersMultiSelect;


