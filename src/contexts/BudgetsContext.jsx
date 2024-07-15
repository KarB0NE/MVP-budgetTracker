import React, { useContext, useState, useEffect } from "react"
import { baseURL } from "./config"
import axios from "axios"

const BudgetsContext = React.createContext();

export const UNCATEGORIZED_BUDGET_ID = "66935cd4609104246c3a73b4";

export function useBudgets() {
  return useContext(BudgetsContext)
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchBudgetData = () => {
      axios.get(`${baseURL}/api/budgets`)
        .then((budgetsResponse) => {
          setBudgets(budgetsResponse.data);
          return axios.get(`${baseURL}/api/expenses`);
        })
        .then((expensesResponse) => {
          setExpenses(expensesResponse.data);
        })
        .catch((error) => {
          console.error('Error fetching budget data:', error);
        });
    };

    fetchBudgetData();
  }, []);


  function getBudgetExpenses(budgetId) {
    return expenses.filter(expense => expense.budgetId === budgetId)
  }

  const addExpense = ({ description, amount, budgetId, successCB, errorCB }) => {
    axios.post(`${baseURL}/api/expenses`, { description, amount, budgetId })
      .then((response) => {
        setExpenses((prevExpenses) => [...prevExpenses, response.data]);
        successCB();
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
        errorCB(error);
      });
  };

  const addBudget = ({ name, max }) => {
    axios.post(`${baseURL}/api/budgets`, { name, max })
      .then((response) => {
        setBudgets((prevBudgets) => [...prevBudgets, response.data]);
      })
      .catch((error) => {
        console.error("Error adding budget:", error);
      });
  };

  const deleteBudget = (id ) => {
    axios.delete(`${baseURL}/api/budgets/${id}`)
      .then(() => {
        setBudgets(prevBudgets => prevBudgets.filter(budget => budget._id !== id));
        setExpenses(prevExpenses => prevExpenses.map(expense => {
          if (expense.budgetId !== id) return expense;
          return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
        }));
      })
      .catch(error => {
        console.error('Error deleting budget:', error);
      });
  };

  const deleteExpense = (id) => {
    axios.delete(`${baseURL}/api/expenses/${id}`)
      .then(() => {
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
      })
      .catch(error => {
        console.error('Error deleting expense:', error);
      });
  };

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  )
}