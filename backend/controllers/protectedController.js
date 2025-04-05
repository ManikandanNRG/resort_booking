const protectedController = {
  getProfile: async (req, res) => {
    try {
      // The user is already available from the auth middleware
      res.status(200).json({
        message: 'Profile accessed successfully',
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getAdminArea: async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'Resort Admin' && req.user.role !== 'System Admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.status(200).json({
        message: 'Admin area accessed successfully',
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error) {
      console.error('Error in getAdminArea:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = protectedController;