const toAuthenticatedUser = (user) => ({
  id: user.id,

  firstName: user.first_name,

  lastName: user.last_name,

  email: user.email,

  phone: user.phone_number,

  role: user.role.name,

  jobType: {
    id: user.jobType.id,

    name: user.jobType.name,
  },

  permissions: user.role.permissions.map((permission) => permission.name),
});

export const userMapper = {
  toAuthenticatedUser,
};
