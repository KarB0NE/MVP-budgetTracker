import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const expenseSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  budgetId: {
    type: Schema.Types.ObjectId,
    ref: 'Budget',
    required: true,
  },
});

const Expense = model('Expense', expenseSchema);

export default Expense;