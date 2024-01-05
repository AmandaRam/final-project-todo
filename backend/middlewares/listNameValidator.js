const listNameValidator = (req, res, next) => {
  const name = req.body.name;
  // Setting up validation with the rules that the name must be defined, not null and have a length of at least 1 character
  if (name === undefined || name === null || name.length < 1) {
    res.status(400).json({ message: "Name should have at least 1 character" });
    return;
  }

  next();
};

export default listNameValidator;
