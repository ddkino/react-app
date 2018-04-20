import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo/index';
import AvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Container, Form, Icon, Input, Message } from 'semantic-ui-react';
import { Loader, Success } from '../../../components/Render';
import { USER_UPDATE_PSEUDO, USER_UPLOAD_AVATAR } from '../../../graphql/userMutations';
import { _P } from '../../../lib';
import { setProfile } from '../../../reducers/users/profile/reducer';
import { store } from '../../../store';
import FileInputPreview from '../../InputForm/FileInputPreview';

/**
 * VALIDATOR
 */

@connect(
  state => ({
    profile: state.profile,
  }),
)
class Avatar extends React.Component {
  constructor (props) {
    super(props);
    this.onFilesChange = this.onFilesChange.bind(this);
    this.onFilesError = this.onFilesError.bind(this);
    this.onFilesRemoveAll = this.onFilesRemoveAll.bind(this);
    this.onFilesRemoveOne = this.onFilesRemoveOne.bind(this);
    this.onClickUpload = this.onClickUpload.bind(this);
    this.onSubmitPseudo = this.onSubmitPseudo.bind(this);

    this.state = {
      pseudo: {
        username_alt: props.profile.username_alt || '',
        submitting: false,
        checked: false,
        error: false,
      },
      token: props.profile.token,
      maxFiles: 1,
      maxSize: 11000000,
      error: '',
      loading: props.appFiles && props.appFiles.length ? true : false,
      uploaded: false,
      files: props.appFiles ? props.appFiles : [],
    };
  }

  // ok change state no re-render
  componentWillMount () {
    if (this.state.token.length < 20) {
      this.setState({
        error: 'Session error',
      });
    } else {
      if (this.props.appFiles && this.props.appFiles.length) {
        setTimeout(() => this.setState(() => ({
          loading: false,
        })), this.props.appFiles.length * 200);
      }
    }
  }

  onFilesChange (files) {
    this.setState(() => ({
      files,
      uploaded: false,
    }));
  }

  onFilesError (error) {
    console.error(error);
    this.setState(() => ({
      error: error.message,
    }));
  }

  onClickUpload () {
    const {files} = this.state;
    const {profile, client} = this.props;

    const avatar = this.refs.canvas.getImageScaledToCanvas();

    // return;
    files.forEach((file) => {
        client.mutate({
          mutation: USER_UPLOAD_AVATAR,
          variables: {
            user_id: profile.user_id,
            avatar: avatar.toDataURL(),
          },
        }).then(response => {
          const payload = response.data.userUploadAvatar;
          const profileNew = Object.assign({}, profile, {
            avatar_filename: payload,
          });
          store.dispatch(setProfile(profileNew));
          this.setState({uploaded: true});
        }).catch(err => {
          console.error(err);
        });
      },
    );
  };

  onFilesRemoveAll (event) {
    event.preventDefault();
    this.setState(() => ({
      error: '',
      uploaded: false,
      files: [],
    }), () => {
      // needed :2 calls children
      this.refs.inputFiles.onFilesRemoveAll();
    });
  }

  onFilesRemoveOne () {
    this.setState(() => ({
      error: '',
      uploaded: false,
    }));
  }

  setInpuFilesRef () {return 'inputFiles';}

  setCanvasRef () {return 'canvas';}

  onSubmitPseudo (e) {
    const value = e.target.value;
    const {profile, client} = this.props;
    if (value.length === 0) return;
    if (value.length > 128) return;
    this.setState({pseudo: {error: false, checked: false, submitting: true}});
    client.mutate({
      mutation: USER_UPDATE_PSEUDO,
      variables: {
        user_id: profile.user_id,
        username_alt: value,
      },
    }).then(response => {
      const payload = response.data.userUpdatePseudo;
      if (payload) {
        const profileNew = Object.assign({}, profile, {
          username_alt: value,
        });
        store.dispatch(setProfile(profileNew));
        this.setState({pseudo: {error: false, checked: true, submitting: false}});
      } else {
        this.setState({pseudo: {error: true, checked: false, submitting: false}});
      }
    }).catch(err => {
      this.setState({pseudo: {error: true, checked: false, submitting: false}});
    });
  }

  render () {
    const {files, progressFiles, loading, uploaded, maxFiles, maxSize, pseudo} = this.state;
    const {profile} = this.props;
    if (loading) return <Loader/>;
    const header = 'Your avatar, click here to select a file';
    return (
      <Form success>
        <Message header={'Your pseudo'}/>
        <Input fluid icon placeholder='my pseudo'>
          <input defaultValue={pseudo.username_alt} onBlur={this.onSubmitPseudo}/>
          {pseudo.submitting && <Icon name='search'/>}
          {pseudo.checked && <Icon name='check' circular inverted color={'green'}/>}
          {pseudo.error && <Icon name='close' circular color={'red'} inverted/>}
        </Input>
        <FileInputPreview ref={this.setInpuFilesRef()}
                          name="files"
                          labelInput={<div>{header}</div>}
                          minFileSize={10}
                          maxFiles={maxFiles} maxFileSize={maxSize}
                          onFilesChange={this.onFilesChange}
                          onFilesRemoveAll={this.onFilesRemoveAll}
                          onFilesRemoveOne={this.onFilesRemoveOne}
                          files={files}
                          onFilesError={this.onFilesError}
                          progressFiles={progressFiles}
                          accepts={['image/*']}
                          preview={'none'}
        />
        {(!files || !files[0]) && profile.avatar_filename &&
        <Container textAlign={'center'}><img src={_P.getAvatar(profile)} width="240" height="240"/></Container>}
        {files && files[0] && <Container textAlign={'center'}>
          {!uploaded && <AvatarEditor
            ref={this.setCanvasRef()}
            image={files[0].preview.url}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.7]} // RGBA
            scale={1.15}
            rotate={0}
          />}
          <br/>
          {uploaded && <Success header={'Your avatar is updated'}/>}
          {!uploaded &&
          <Form.Field><Button icon='upload' type="button" disabled={(files.length === 0)} onClick={this.onClickUpload}
                              label={'Upload'} primary/></Form.Field>}
        </Container>}
      </Form>
    );
  }
}

Avatar.propTypes = {
  profile: PropTypes.object,
  client: PropTypes.object, // graphql
};

export default reduxForm({
  form: 'userDashboard',
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withApollo(Avatar));

