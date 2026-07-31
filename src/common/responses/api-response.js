const success = (res, data = null, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const error = (
  res,
  message = "Something went wrong",
  errors = null,
  status = 500,
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

export const ApiResponse = {
  success,
  error,
};
