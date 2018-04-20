import PropTypes from 'prop-types';
import { Icon, Image, Item } from 'semantic-ui-react';
import { _P } from '../../lib';

class ContactItem extends React.PureComponent {
  render () {
    const {contact, isSelected, onClick} = this.props;
    // console.log('render', contact);
    return (
      <Item>
        {contact.avatar_filename && <Image avatar src={_P.getAvatar(contact.avatar_filename)}/>}
        <Item.Content>
          <Item.Header id={contact.user_id}
                       as='a'
                       onClick={onClick}>@{contact.username}{contact.username_alt ? ' / ' + contact.username_alt : ''}{' '}
            {isSelected && <Icon aria-label={'selected'} size={'small'} name='check' circular color={'green'}/>}
          </Item.Header>
        </Item.Content>
      </Item>
    );
  }
};

ContactItem.propTypes = {
  contacts: PropTypes.array,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ContactItem;
