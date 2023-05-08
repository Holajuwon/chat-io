export default {
  registerUser: `
    INSERT INTO users(
      username,
      email,
      hashed_password,
      salt
    )
    VALUES($1, $2, $3, $4)
    RETURNING *`,

  getUserByEmail: `
     SELECT *
     FROM users
     WHERE email = $1;
  `,

  getUserById: `
     SELECT *
     FROM users
     WHERE id = $1;
  `,
};
