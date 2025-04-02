const { Resort, RoomType } = require('../src/models');
const { isUUID } = require('validator');

const roomTypeController = {
  // Get all room types for a resort
  getAllRoomTypes: async (req, res) => {
    try {
      const { id } = req.params; // resort id
      if (!isUUID(id)) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      const resort = await Resort.findByPk(id, {
        include: [{
          model: RoomType,
          as: 'roomTypes'
        }]
      });

      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      res.json(resort.roomTypes);
    } catch (error) {
      console.error('Error in getAllRoomTypes:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get single room type
  getRoomTypeById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(404).json({ message: 'Room type not found' });
      }

      const roomType = await RoomType.findByPk(id);
      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }

      res.json(roomType);
    } catch (error) {
      console.error('Error in getRoomTypeById:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Create room type
  createRoomType: async (req, res) => {
    try {
      const { id } = req.params; // resort id
      const resort = await Resort.findByPk(id);
      
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to add room types to this resort' });
      }

      const roomType = await RoomType.create({
        ...req.body,
        resort_id: id
      });

      res.status(201).json(roomType);
    } catch (error) {
      console.error('Error in createRoomType:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Update room type
  updateRoomType: async (req, res) => {
    try {
      const { id } = req.params;
      const roomType = await RoomType.findByPk(id, {
        include: [{ model: Resort, as: 'resort' }]
      });

      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }

      if (roomType.resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this room type' });
      }

      await roomType.update(req.body);
      res.json(roomType);
    } catch (error) {
      console.error('Error in updateRoomType:', error);
      res.status(400).json({ message: error.message });
    }
  },

  // Delete room type
  deleteRoomType: async (req, res) => {
    try {
      const { id } = req.params;
      const roomType = await RoomType.findByPk(id, {
        include: [{ model: Resort, as: 'resort' }]
      });

      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }

      if (roomType.resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this room type' });
      }

      await roomType.destroy();
      res.json({ message: 'Room type deleted successfully' });
    } catch (error) {
      console.error('Error in deleteRoomType:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = roomTypeController;