const { Resort, RoomType } = require('../src/models');

const roomTypeController = {
  getAllRoomTypes: async (req, res) => {
    try {
      const { id } = req.params; // resort id
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

  createRoomType: async (req, res) => {
    try {
      const { id } = req.params; // resort id
      const {
        name,
        description,
        base_price,
        capacity,
        size_sqft,
        bed_configuration,
        amenities,
        policies,
        display_order
      } = req.body;

      const resort = await Resort.findByPk(id);
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }

      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to add room types to this resort' });
      }

      const roomType = await RoomType.create({
        resort_id: id,
        name,
        description,
        base_price,
        capacity,
        size_sqft,
        bed_configuration,
        amenities,
        policies,
        display_order,
        is_active: true
      });

      res.status(201).json(roomType);
    } catch (error) {
      console.error('Error in createRoomType:', error);
      res.status(400).json({ message: error.message });
    }
  },

  getRoomTypeById: async (req, res) => {
    try {
      const { id } = req.params;
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

  updateRoomType: async (req, res) => {
    try {
      const { id } = req.params;
      const roomType = await RoomType.findByPk(id);
  
      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }
  
      // Get the resort to check ownership
      const resort = await Resort.findByPk(roomType.resort_id);
      
      if (resort.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this room type' });
      }
  
      await roomType.update(req.body);
      res.json(roomType);
    } catch (error) {
      console.error('Error in updateRoomType:', error);
      res.status(400).json({ message: error.message });
    }
  },

  deleteRoomType: async (req, res) => {
    try {
      const { id } = req.params;
      const roomType = await RoomType.findByPk(id);
  
      if (!roomType) {
        return res.status(404).json({ message: 'Room type not found' });
      }
  
      // Get the resort to check ownership
      const resort = await Resort.findByPk(roomType.resort_id);
      
      if (resort.owner_id !== req.user.id) {
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