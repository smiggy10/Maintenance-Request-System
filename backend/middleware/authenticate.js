const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  // If no token is provided, send an access denied response
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Use JWT_SECRET from environment variables
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      // If JWT_SECRET is not set, log a warning
      console.error('JWT_SECRET is not defined in the environment variables.');
      return res.status(500).json({ message: 'Internal server error. JWT secret is missing.' });
    }

    // Verify the token with the secret stored in environment variables
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If the token is invalid, send a response with an error message
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
