import express from 'express';
import connectToDatabase from './db.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import Budget from './models/budget.js';
import Expense from './models/expense.js';

const app = express();
const port = process.env.PORT || 5001;
app.use(cors())
app.use(bodyParser.json())

connectToDatabase().then(() => {

  app.get('/api/budgets', async (req, res) => {
    try {
      const budgets = await Budget.find({});
      res.json(budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  });

  app.post('/api/budgets', async (req, res) => {
    try {
      const newBudget = new Budget(req.body);
      await newBudget.save();
      res.json(newBudget);
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ error: 'Failed to create budget' });
    }
  });

  app.delete('/api/budgets/:id', async (req, res) => {
    try {
      const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
      if (!deletedBudget) {
        return res.status(404).json({ error: 'Budget not found' });
      }
      await Expense.updateMany(
        { budgetId: req.params.id },
        { $unset: { budgetId: "" } }
      );
      res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
      console.error('Error deleting budget:', error);
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  });


  app.get('/api/expenses', async (req, res) => {
    try {
      const expenses = await Expense.find({});
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  });

  app.post('/api/expenses', async (req, res) => {
    if (req.body.budgetId === "Uncategorized") {
      req.body.budgetId = '66935cd4609104246c3a73b4';
    }
    try {
      const newExpense = new Expense(req.body);
      await newExpense.save();
      res.json(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Failed to create expense' });
    }
  });

  app.delete('/api/expenses/:id', async (req, res) => {
    try {
      const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
      if (!deletedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  });


  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
  }).catch(error => {
  console.error('Failed to start server due to database connection error:', error);
  process.exit(1);
});