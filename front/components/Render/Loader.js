import { Loader } from 'semantic-ui-react';

class Loading extends React.Component {
  render () {
    return (
      <Loader active inline='centered'/>
    );
  }
}

export default Loading;