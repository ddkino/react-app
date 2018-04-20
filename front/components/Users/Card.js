import { graphql, withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import { USER_BY_ID } from '../../graphql/userQueriesBy';

class UserCard extends React.Component {
  render () {
    const {data: {loading, error, userFindById}} = this.props;
    const result = userFindById;
    if (loading && !result) {
      return <div>loading</div>;
    }
    if (error) {
      return <div>error user unknown</div>;
    }
    return (
      <div><h3>user card</h3></div>
    );
  }
}

UserCard.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default graphql(USER_BY_ID, {
  options: (props) => {
    return {
      variables: {
        userId: props.userId,
      },
    };
  },
})(withApollo(UserCard));