import mongoose from 'mongoose';
import budget from './models/budget.js';
import expense from './models/expense.js';

mongoose.connect('mongodb://localhost:27017/budgetTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    await budget.deleteMany();
    await expense.deleteMany();

    await budget.insertMany({name: "Uncategorized", _id: "66935cd4609104246c3a73b4", max: 0});

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();