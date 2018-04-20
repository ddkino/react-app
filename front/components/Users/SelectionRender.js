import PropTypes from 'prop-types';
import { Item, Label, Button } from 'semantic-ui-react';


class SelectionRender extends React.PureComponent {
  render () {
    const {content, onClick} = this.props;
    return (
      <React.Fragment>
        <Item.Group key={'contacts-2'}>
          {content.map(contact => {
            if (!contact || !contact.user_id) return null;
            return <Label as='a' image key={contact.user_id} onClick={(e)=>onClick(e, contact)}>
              <img src={contact.avatar_filename}/>@{contact.username}</Label>;
          })}
        </Item.Group>
      </React.Fragment>
    );
  }
}

SelectionRender.propTypes = {
  content: PropTypes.array.isRequired,
  selector: PropTypes.array,
  onClick: PropTypes.func,
};

export default SelectionRender;

