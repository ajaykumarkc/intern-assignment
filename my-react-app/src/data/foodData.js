export const categories = [
    "Pizza", "Burgers", "Sushi", "Indian", "Chinese", "Mexican", "Italian", "Thai", "Desserts", "Healthy", "Seafood", "Mediterranean"
  ];
  
  export const dietaryOptions = [
    "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Organic", "Keto", "Dairy-Free", "Nut-Free"
  ];
  
  export const foodItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic delight with 100% real mozzarella cheese",
      price: 12.99,
      rating: 4.2,
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
      rating: 3.8,
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
      rating: 4.6,
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
      rating: 4.7,
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
      rating: 4.1,
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
      rating: 4.3,
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
      rating: 3.9,
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
      rating: 4.8,
      category: "Desserts",
      imageUrl: "https://www.chefkunalkapur.com/wp-content/uploads/2022/02/choco-lava-cake-eggelss-2-scaled.jpg?v=1644716501",
      deliveryTime: "15-20 min",
      dietary: ["Vegetarian"],
    },
    {
      id: 9,
      name: "Pepperoni Pizza",
      description: "Spicy pepperoni slices on a crispy crust with melted mozzarella.",
      price: 14.99,
      rating: 4.4,
      category: "Pizza",
      imageUrl: "https://cdn.uengage.io/uploads/5/image-579987-1715686804.png",
      deliveryTime: "25-30 min",
      dietary: [],
    },
    {
      id: 10,
      name: "Bacon Deluxe Burger",
      description: "Juicy beef patty with crispy bacon, cheddar cheese, and special sauce.",
      price: 12.50,
      rating: 3.7,
      category: "Burgers",
      imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "20-25 min",
      dietary: [],
    },
    {
      id: 11,
      name: "Salmon Nigiri",
      description: "Fresh salmon over seasoned rice, a sushi classic.",
      price: 8.50,
      rating: 4.5,
      category: "Sushi",
      imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "30-35 min",
      dietary: [],
    },
    {
      id: 12,
      name: "Chicken Tikka Masala",
      description: "Tender chicken in a creamy, spiced tomato sauce with basmati rice.",
      price: 16.25,
      rating: 4.6,
      category: "Indian",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "35-45 min",
      dietary: [],
    },
    {
      id: 13,
      name: "Kung Pao Chicken",
      description: "Spicy diced chicken with peanuts, vegetables, and chili peppers.",
      price: 13.75,
      rating: 3.5,
      category: "Chinese",
      imageUrl: "https://thatspicychick.com/wp-content/uploads/2018/12/Kung-Pao-Chicken-Reshoot-11_PS.jpg",
      deliveryTime: "25-30 min",
      dietary: [],
    },
    {
      id: 14,
      name: "Fish Tacos",
      description: "Grilled fish with cabbage slaw, lime crema, and corn tortillas.",
      price: 11.25,
      rating: 4.0,
      category: "Mexican",
      imageUrl: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "20-25 min",
      dietary: [],
    },
    {
      id: 15,
      name: "Margherita Risotto",
      description: "Creamy risotto with fresh mozzarella, basil, and cherry tomatoes.",
      price: 15.50,
      rating: 3.8,
      category: "Italian",
      imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "30-40 min",
      dietary: ["Vegetarian"],
    },
    {
      id: 16,
      name: "Green Curry",
      description: "Spicy green curry with chicken, bamboo shoots, and Thai basil.",
      price: 14.25,
      rating: 4.2,
      category: "Thai",
      imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "25-30 min",
      dietary: [],
    },
    {
      id: 17,
      name: "Acai Bowl",
      description: "Fresh acai puree topped with granola, banana, and berries.",
      price: 9.75,
      rating: 4.4,
      category: "Healthy",
      imageUrl: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "15-20 min",
      dietary: ["Vegan", "Vegetarian", "Gluten-Free"],
    },
    {
      id: 18,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon herb butter and seasonal vegetables.",
      price: 22.50,
      rating: 4.9,
      category: "Seafood",
      imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "30-35 min",
      dietary: ["Gluten-Free"],
    },
    {
      id: 19,
      name: "Greek Salad",
      description: "Fresh mixed greens with feta, olives, cucumber, and Mediterranean dressing.",
      price: 10.25,
      rating: 2.8,
      category: "Mediterranean",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "15-20 min",
      dietary: ["Vegetarian", "Gluten-Free"],
    },
    {
      id: 20,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.",
      price: 8.99,
      rating: 4.7,
      category: "Desserts",
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      deliveryTime: "15-20 min",
      dietary: ["Vegetarian"],
    }
  ];