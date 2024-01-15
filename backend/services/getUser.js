import User from "../models/User";

// This function will get a user from the database, or create a new user if the user does not exist
const getUser = async (externalId) => {
  let user = await User.findOne({ externalId });

  if (user === null) {
    user = new User({ externalId });
    await user.save();
  }

  return user;
};

export default getUser;
