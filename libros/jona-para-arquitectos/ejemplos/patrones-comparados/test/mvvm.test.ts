import { createMvvmLogin } from '../src/mvvm/createLogin.js';
import { describeLoginBehavior } from './loginBehavior.js';

describeLoginBehavior('MVVM', createMvvmLogin);
