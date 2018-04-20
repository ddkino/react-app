import PropTypes from 'prop-types';
import { Message, Icon } from 'semantic-ui-react';

class Success extends React.Component {
  render () {
    const {header, content, icon } = this.props;
    if (header + content === '') return null;
    return (
      <Message success icon>
        {icon && <Icon name={icon}/>}
        <Message.Header>{header}</Message.Header>
        {content && content.length > 0 && <p>{content}</p>}
      </Message>
    );
  }
}

Success.propTypes = {
  header: PropTypes.string,
  content: PropTypes.string,
  icon: PropTypes.string,
};

Success.defaultProps = {
  header: '',
  content: '',
};

export default Success;