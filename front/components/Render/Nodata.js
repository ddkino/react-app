import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

class Nodata extends React.PureComponent {
  render () {
    const {header, content} = this.props;
    return (
      <Message warning>
        <Message.Content>
          <Message.Header>{header}</Message.Header>
          {content}
        </Message.Content>
      </Message>
    );
  }
}

Nodata.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string,
};

Nodata.defaultProps = {
  header: 'No data',
  content: '',
};

export default Nodata;