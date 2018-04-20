import EventEmitter from 'events';
import nats from '../../nats';

export const graphEvent = new EventEmitter();
export const validationEvent = new EventEmitter();
export const DbEventError = new EventEmitter();
export const DbEventSuccess = new EventEmitter();

// todo nats events <type> <name> <message> <value>
//--------------------------------------------
// USER
//--------------------------------------------

DbEventSuccess.on('USER_UPDATE_PASSWORD', (message, value) => {
  nats.publish('event.user.update_password', JSON.stringify(value));
});
DbEventError.on('USER_UPDATE_PASSWORD', (message, value) => {
  nats.publish('event.cha.update_password.error', JSON.stringify(value));
});

DbEventSuccess.on('USER_REGISTER_WITH_EMAIL', (message, value) => {
  nats.publish('event.signup.welcome', JSON.stringify(value));
});
