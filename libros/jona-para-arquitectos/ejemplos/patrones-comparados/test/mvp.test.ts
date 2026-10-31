import { createMvpLogin } from '../src/mvp/createLogin.js';
import { describeLoginBehavior } from './loginBehavior.js';

describeLoginBehavior('MVP', createMvpLogin);
