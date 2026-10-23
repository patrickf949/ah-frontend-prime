// React 19 is not supported by Enzyme. Component tests should be migrated to
// Testing Library instead of configuring an Enzyme adapter here.
const { TextDecoder, TextEncoder } = require("util");

global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
