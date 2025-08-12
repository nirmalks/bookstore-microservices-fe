/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder as any;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as any;
}