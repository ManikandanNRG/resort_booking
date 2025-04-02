const { Resort, RoomType, User } = require('../src/models');
const { isUUID } = require('validator');

const resortController = {
  getAllResorts: async (req, res) => {
    try {
      const resorts = await Resort.findAll({
        include: [
          {
            model: RoomType,
            as: 'roomTypes'
          }
        ]
      });
      res.json(resorts);
    } catch (error) {
      console.error('Error in getAllResorts:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getResortById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(404).json({ message: 'Resort not found' });
      }
      const resort = await Resort.findByPk(id, {
        include: [
          {
            model: RoomType,
            as: 'roomTypes'
          }
        ]
      });
      
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }
      res.json(resort);
    } catch (error) {
      console.error('Error in getResortById:', error);
      res.status(500).json({ message: error.message });
    }
  },

  createResort: async (req, res) => {
    try {
      const resort = await Resort.create({
        ...req.body,
        owner_id: req.user.id
      });
      res.status(201).json(resort);
    } catch (error) {
      console.error('Error in createResort:', error);
      res.status(400).json({ message: error.message });
    }
  },

  updateResort: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      const resort = await Resort.findByPk(id);
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }
      
      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this resort' });
      }

      await resort.update(req.body);
      res.json(resort);
    } catch (error) {
      console.error('Error in updateResort:', error);
      res.status(400).json({ message: error.message });
    }
  },

  deleteResort: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      const resort = await Resort.findByPk(id);
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this resort' });
      }

      await resort.destroy();
      res.json({ message: 'Resort deleted successfully' });
    } catch (error) {
      console.error('Error in deleteResort:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = resortController;