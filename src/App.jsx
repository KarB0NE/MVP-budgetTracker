import { useState } from "react"
import { Button, Stack } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import AddBudgetModal from "./components/AddBudgetModal"
import AddExpenseModal from "./components/AddExpenseModal"
import ViewExpensesModal from "./components/ViewExpensesModal"
import BudgetCard from "./components/BudgetCard"
import TotalBudgetCard from "./components/TotalBudgetCard"
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./contexts/BudgetsContext"

function App() {
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()
  const [addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState(UNCATEGORIZED_BUDGET_ID)

  const { budgets, getBudgetExpenses } = useBudgets()

  function openAddExpenseModal(budgetId = UNCATEGORIZED_BUDGET_ID) {
    setShowAddExpenseModal(true);
    setAddExpenseModalBudgetId(budgetId);
  }

  const onViewExpensesClick = (budgetId) => {
    setViewExpensesModalBudgetId(budgetId);
    setShowAddExpenseModal(false);
    setShowAddBudgetModal(false);
  };

  return (
    <>
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-4">
          <h1 className="me-auto">Budget Tracker</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>
            Add Budget
          </Button>
          <Button variant="outline-primary" onClick={() => openAddExpenseModal()}>
            Add Expense
          </Button>
        </Stack>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {budgets
            .filter((budget) => budget._id !== UNCATEGORIZED_BUDGET_ID)
            .map((budget) => {
              const amount = getBudgetExpenses(budget._id).reduce(
                (total, expense) => total + expense.amount,
                0
              );

          return (
            <BudgetCard
              key={budget._id}
              name={budget.name}
              amount={amount}
              max={budget.max}
              onAddExpenseClick={() => openAddExpenseModal(budget._id)}
              onViewExpensesClick={() => onViewExpensesClick(budget._id)}
            />
            )
          })}
          {getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).length > 0 && (
            <BudgetCard
              key={UNCATEGORIZED_BUDGET_ID}
              name="Uncategorized"
              amount={getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
                (total, expense) => total + expense.amount,
                0
              )}
              gray
              onAddExpenseClick={() => openAddExpenseModal(UNCATEGORIZED_BUDGET_ID)}
              onViewExpensesClick={() =>
                setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
              }
            />
          )}
          <TotalBudgetCard/>
        </div>
      </Container>
      <AddBudgetModal
        show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)}
      />
      <AddExpenseModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  )
}

export default App