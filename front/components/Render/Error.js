import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

class Error extends React.Component {
  render () {
    const {header, content, icon} = this.props;
    if (header + content === '') return null;
    return (
      <Message error icon>
        {icon && <Icon name={icon}/>}
        <Message.Header>{header}</Message.Header>
        {content && content.length > 0 && <p>{content}</p>}
      </Message>
    );
  }
}

Error.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string,
  icon: PropTypes.string,
};

Error.defaultProps = {
  header: '',
  content: '',
};

export default Error;