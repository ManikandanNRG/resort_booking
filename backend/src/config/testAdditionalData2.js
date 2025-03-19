// Create test subscription plan
    const subscriptionPlan = await SubscriptionPlan.create({
      id: uuidv4(),
      resort_id: resort.id,    // Ensure this matches the resort.id
      name: 'Premium',
      price: 99.99,
      max_rooms: 50,
      max_admins: 5,
      allowed_features: {      // Changed from features to allowed_features
        marketing: true,
        analytics: true,
        priority_support: true
      }
    });

    // Create test room availability
        const roomAvailability = await RoomAvailability.create({
          id: uuidv4(),
          resort_id: resort.id,    // Ensure this matches the resort.id
          room_id: room.id,
          date: new Date(Date.now() + 86400000),
          status: 'Available',
          price: 299.99
        });