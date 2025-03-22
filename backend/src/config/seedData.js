const db = require('../models');

async function seedDatabase() {
  try {
    // Clear existing data
    await db.sequelize.sync({ force: true });
    console.log('✓ Database cleared');

    console.log('Starting to seed database...');

    // 1. Create Subscription Plans
    const subscriptionPlan = await db.SubscriptionPlan.create({
      name: 'Basic',  // Changed to match enum value
      price: 99.99,
      features: ['All features', 'Priority support', 'Unlimited rooms'],
      duration: 30,
      max_rooms: 50,
      max_admins: 5,
      allowed_features: ['booking', 'analytics']  // Added allowed_features array
    });
    console.log('✓ Subscription Plan created');

    // Rest of your seed data remains the same
    const user = await db.User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',  // Changed email
      password: 'password123',
      role: 'Customer'
    });
    console.log('✓ Customer User created');

    const resortOwner = await db.User.create({
      name: 'Resort Owner',
      email: 'resort.owner@example.com',  // Changed email
      password: 'password123',
      role: 'Resort Owner'
    });
    console.log('✓ Resort Owner created');

    // 3. Create Resort with required fields
    const resort = await db.Resort.create({
      name: 'Luxury Beach Resort',
      description: 'A beautiful beach resort',
      location: 'Beach City',
      subscription_plan_id: subscriptionPlan.id,
      owner_id: resortOwner.id,
      contact_email: resortOwner.email
    });
    console.log('✓ Resort created');

    // 4. Create Resort Admin (no need for explicit association)
    const resortAdmin = await db.ResortAdmin.create({
      user_id: resortOwner.id,
      resort_id: resort.id,
      access_level: 'Full'
    });
    console.log('✓ Resort Admin created');

    // 5. Create Room Types
    const roomType = await db.RoomType.create({
      resort_id: resort.id,
      name: 'Deluxe Suite',
      description: 'Luxury room with ocean view',
      base_price: 299.99,
      capacity: {
        adults: 2,
        children: 2
      },
      size_sqft: 500,
      bed_configuration: {
        king: 1,
        sofa: 1
      },
      amenities: ['AC', 'WiFi', 'Mini Bar'],
      status: 'Active'
    });
    console.log('✓ Room Type created');

    // 6. Create Room
    const room = await db.Room.create({
      resort_id: resort.id,
      room_type_id: roomType.id,
      name: 'Deluxe Ocean View 101',
      room_number: '101',
      floor: '1',
      size: 'Standard',
      price_per_night: roomType.base_price,
      capacity: 4,
      status: 'Available',
      amenities: [],
      maintenance_status: 'Good'
    });
    console.log('✓ Room created');

    // 7. Create Amenity
    const amenity = await db.Amenity.create({
      name: 'Ocean View Balcony',
      description: 'Private balcony with ocean view',
      category: 'Luxury',  // Must match ENUM values
      icon: 'https://example.com/icons/balcony.png',
      is_chargeable: true,
      price: 50.00,
      price_type: 'per_night',
      availability: {
        always_available: true,
        schedule: null,
        max_capacity: null,
        requires_booking: false,
        advance_booking_required: false,
        booking_lead_time_hours: 0
      },
      is_active: true,
      display_order: 1
    });
    console.log('✓ Amenity created');

    // Create another amenity (complimentary)
    const amenity2 = await db.Amenity.create({
      name: 'WiFi',
      description: 'High-speed wireless internet',
      category: 'Basic',
      icon: 'https://example.com/icons/wifi.png',
      is_chargeable: false,  // Will automatically set price to 0 and price_type to complimentary
      is_active: true,
      display_order: 2
    });
    console.log('✓ Basic Amenity created');

    // 8. Create Room Availability
    const roomAvailability = await db.RoomAvailability.create({
      room_id: room.id,
      date: new Date(),
      status: 'Available',
      price_modifier: 1.0
    });
    console.log('✓ Room Availability created');

    // After creating user
    const guestProfile = await db.GuestProfile.create({
      user_id: user.id,
      preferences: {
        room_type: 'Suite',
        dietary: ['Vegetarian'],
        special_requests: ['High Floor'],
        amenities: ['WiFi', 'Pool']
      },
      identification: {
        type: 'Passport',
        number: 'AB123456',
        country_of_issue: 'USA',
        expiry_date: '2025-12-31'
      },
      emergency_contact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1-555-0123',
        email: 'jane.doe@example.com'
      },
      loyalty_points: 100,
      membership_tier: 'Silver',
      total_stays: 5,
      total_spent: 1500.00
    });
    console.log('✓ Guest Profile created');
    
    // Add Booking
    const booking = await db.Booking.create({
      user_id: user.id,
      resort_id: resort.id,
      room_id: room.id,
      check_in: new Date('2024-02-01'),
      check_out: new Date('2024-02-05'),
      status: 'Confirmed'
    });
    console.log('✓ Booking created');
    
    // Add Payment
    const payment = await db.Payment.create({
      booking_id: booking.id,
      amount: 1499.95,
      payment_method: 'Credit Card',
      transaction_id: 'TXN' + Date.now(),
      status: 'Success',
      payment_date: new Date()
    });
    console.log('✓ Payment created');
    
    // Add Review
    const review = await db.Review.create({
      user_id: user.id,
      resort_id: resort.id,
      rating: 5,
      title: 'Excellent Stay!',
      review: 'Had a wonderful experience. The staff was very courteous and helpful.',
      checkin_date: new Date('2024-02-01'),
      checkout_date: new Date('2024-02-05'),
      is_verified: true
    });
    console.log('✓ Review created');
    
    // Add Review Response
    const reviewResponse = await db.ReviewResponse.create({
      review_id: review.id,
      responder_id: resortOwner.id,
      response: 'Thank you for your wonderful review! We are glad you enjoyed your stay.',
      is_published: true
    });
    console.log('✓ Review Response created');

    // Add Resort Facility
    const resortFacility = await db.ResortFacility.create({
      resort_id: resort.id,
      facility_name: 'Swimming Pool',  // Changed from 'name' to 'facility_name'
      description: 'Large outdoor pool with jacuzzi',
      category: 'Recreation',
      operating_hours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '06:00', close: '23:00' },
        sunday: { open: '06:00', close: '23:00' }
      },
      status: 'Operational'
    });
    console.log('✓ Resort Facility created');

    // Add Resort Image
    const resortImage = await db.ResortImage.create({
      resort_id: resort.id,
      image_url: 'https://example.com/images/resort-main.jpg',  // Changed from 'url' to 'image_url'
      caption: 'Resort Main View',
      category: 'Exterior',
      is_primary: true,
      display_order: 1
    });
    console.log('✓ Resort Image created');

    // Add Marketing Tool
    const marketingTool = await db.MarketingTool.create({
      resort_id: resort.id,
      name: 'Summer Special',
      campaign_type: 'Discount',
      start_date: new Date('2025-06-01'),  // Changed to 2025 to ensure future date
      end_date: new Date('2025-08-31'),    // Changed to 2025 to match start_date
      content: {
        title: 'Summer Special 2024',
        description: 'Get 20% off on all bookings',
        terms: ['Valid till August 2025', 'Not valid with other offers']  // Updated year in terms
      },
      discount_percentage: 20,
      status: 'Active'
    });
    console.log('✓ Marketing Tool created');

    // Add Promotion
    const promotion = await db.Promotion.create({
      resort_id: resort.id,
      name: 'Early Bird Special',
      description: 'Book 30 days in advance and get 15% off',
      discount_type: 'percentage',  // Changed to lowercase to match enum
      discount_value: 15,
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-12-31'),
      min_stay_days: 2,
      max_discount_amount: 500,
      terms_conditions: 'Must book 30 days in advance. Valid for all room types. Cannot be combined with other offers.',
      code: 'EARLY15',
      usage_limit: 100,
      is_active: true,
      applicable_room_types: [],
      blackout_dates: []
    });
    console.log('✓ Promotion created');

    // Add Maintenance Schedule
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);  // Set to 30 days from now
    
    const maintenance = await db.MaintenanceSchedule.create({
      room_id: room.id,
      scheduled_by: resortAdmin.user_id,
      maintenance_type: 'Routine',
      priority: 'Medium',
      description: 'Regular room maintenance and deep cleaning',
      scheduled_date: futureDate,
      start_date: new Date(futureDate.setHours(9, 0, 0)),  // 9:00 AM on future date
      end_date: new Date(futureDate.setHours(11, 0, 0)),   // 11:00 AM on future date
      estimated_duration: 120,
      status: 'Scheduled'
    });
    console.log('✓ Maintenance Schedule created');

    // Add Automated Pricing
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);  // Set to tomorrow
    
    const automatedPricing = await db.AutomatedPricing.create({
      resort_id: resort.id,
      room_id: room.id,
      rules: {
        weekend_multiplier: 1.2,
        holiday_multiplier: 1.5,
        low_occupancy_discount: 0.9,
        high_demand_multiplier: 1.3
      },
      suggested_price: roomType.base_price * 1.1,
      current_price: roomType.base_price,
      valid_from: tomorrow,  // Changed to tomorrow
      valid_until: new Date(tomorrow.getFullYear() + 1, tomorrow.getMonth(), tomorrow.getDate()), // One year from tomorrow
      is_active: true
    });
    console.log('✓ Automated Pricing created');

    // Add Notification
    const notification = await db.Notification.create({
      user_id: user.id,
      title: 'Booking Confirmation',
      message: 'Your booking has been confirmed',
      type: 'Booking',
      priority: 'High',
      status: 'Unread'
    });
    console.log('✓ Notification created');

    // Add Audit Log
    const auditLog = await db.AuditLog.create({
      user_id: resortOwner.id,
      action: 'CREATE',
      entity_type: 'Resort',
      entity_id: resort.id,
      changes: {
        name: resort.name,
        location: resort.location
      },
      ip_address: '127.0.0.1'
    });
    console.log('✓ Audit Log created');

    console.log('All test data seeded successfully');
    return true;

  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

module.exports = seedDatabase;