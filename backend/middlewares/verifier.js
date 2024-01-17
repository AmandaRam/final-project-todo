import { jwtVerify } from "@kinde-oss/kinde-node-express";

// This is the middleware that will verify the JWT token, get the id from the token, and add the id to the request object
const verifier = jwtVerify(process.env.KINDE_DOMAIN);

export default verifier;
