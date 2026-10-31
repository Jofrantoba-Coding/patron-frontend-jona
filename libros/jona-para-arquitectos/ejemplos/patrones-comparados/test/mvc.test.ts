import { createMvcLogin } from '../src/mvc/createLogin.js';
import { describeLoginBehavior } from './loginBehavior.js';

describeLoginBehavior('MVC', createMvcLogin);
