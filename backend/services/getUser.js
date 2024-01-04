import User from "../models/User";

// This function will get a user from the database
const getUser = async (externalId) => {
  const user = await User.findOne({ externalId });
  return user;
};

export default getUser;
