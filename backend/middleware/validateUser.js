const validateSignup = (req, res, next) => {
    console.log('Request body:', req.body);  // This will help see the incoming request body
    const { name, username, email, password, confirmPassword } = req.body;
  
    if (!name || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    // Check if the email is in a valid format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  
    next();
  };
  