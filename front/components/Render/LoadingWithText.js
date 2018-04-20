import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

class LoadingWithText extends React.Component {
  render () {
    const {header, content} = this.props;
    return (
      <Message icon>
        <Icon name='circle notched' loading/>
        <Message.Content>
          <Message.Header>{header}</Message.Header>
          {content}
        </Message.Content>
      </Message>
    );
  }
}

LoadingWithText.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string,
};

LoadingWithText.defaultProps = {
  header: '',
  content: '',
};
export default LoadingWithText;


