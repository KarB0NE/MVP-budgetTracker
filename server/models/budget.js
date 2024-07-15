import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const budgetSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  max: {
    type: Number,
    required: true,
    min: 0
  }
});

const Budget = model('Budget', budgetSchema);
export default Budget;