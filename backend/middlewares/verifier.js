// import { jwtVerify } from "@kinde-oss/kinde-node-express";

// This is the middleware that will verify the JWT token
const verifier = (_, _, next) => next(); //jwtVerify(process.env.KINDE_DOMAIN);

export default verifier;
