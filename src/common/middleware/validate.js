export const validate = (schema) => (req, res, next) => {
  console.log({ body: req.body });
  try {
    req.body = schema.parse(req.body);

    next();
  } catch (error) {
    next(error);
  }
};
