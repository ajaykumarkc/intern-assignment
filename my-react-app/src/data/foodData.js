

export const categories = [
    "Pizza", "Burgers", "Sushi", "Indian", "Chinese", "Mexican", "Italian", "Thai", "Desserts", "Healthy"
  ];
  
  export const dietaryOptions = [
    "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Organic", "Keto"
  ];
  
  export const foodItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic delight with 100% real mozzarella cheese",
      price: 12.99,
      rating: 4.5,
      category: "Pizza",
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "25-30 min",
      dietary: ["Vegetarian"],
    },
    {
      id: 2,
      name: "Classic Cheeseburger",
      description: "A signature flame-grilled beef patty topped with a simple layer of melted American cheese.",
      price: 8.50,
      rating: 4.2,
      category: "Burgers",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "20-25 min",
      dietary: [],
    },
    {
      id: 3,
      name: "California Roll",
      description: "Crab, avocado, and cucumber rolled in seasoned rice.",
      price: 10.00,
      rating: 4.7,
      category: "Sushi",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "30-35 min",
      dietary: [],
    },
    {
      id: 4,
      name: "Butter Chicken",
      description: "Tender chicken cooked in a rich, creamy tomato-based sauce.",
      price: 15.75,
      rating: 4.8,
      category: "Indian",
      imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "35-45 min",
      dietary: [],
    },
    {
      id: 5,
      name: "Pad Thai",
      description: "Stir-fried rice noodles with shrimp, tofu, peanuts, and bean sprouts.",
      price: 13.25,
      rating: 4.4,
      category: "Thai",
      imageUrl: "https://inquiringchef.com/wp-content/uploads/2023/02/Authentic-Pad-Thai_square-1908.jpg",
      deliveryTime: "25-30 min",
      dietary: [],
    },
    {
      id: 6,
      name: "Vegan Buddha Bowl",
      description: "A hearty bowl of quinoa, roasted vegetables, chickpeas, and tahini dressing.",
      price: 11.50,
      rating: 4.6,
      category: "Healthy",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoeSUyMGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "20-25 min",
      dietary: ["Vegan", "Vegetarian", "Gluten-Free"],
    },
    {
      id: 7,
      name: "Spaghetti Carbonara",
      description: "Classic Italian pasta with eggs, Pecorino Romano, pancetta, and black pepper.",
      price: 14.00,
      rating: 4.3,
      category: "Italian",
      imageUrl: "https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg",
      deliveryTime: "30-40 min",
      dietary: [],
    },
    {
      id: 8,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a gooey molten center, served with vanilla ice cream.",
      price: 7.50,
      rating: 4.9,
      category: "Desserts",
      imageUrl: "https://www.chefkunalkapur.com/wp-content/uploads/2022/02/choco-lava-cake-eggelss-2-scaled.jpg?v=1644716501",
      deliveryTime: "15-20 min",
      dietary: ["Vegetarian"],
    }
  ];