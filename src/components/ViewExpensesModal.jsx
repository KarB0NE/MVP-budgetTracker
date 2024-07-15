import { Modal, Button, Stack } from "react-bootstrap";
import {
  UNCATEGORIZED_BUDGET_ID,
  useBudgets,
} from "../contexts/BudgetsContext";
import { currencyFormatter } from "../utils";

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } = useBudgets();

  const expenses = getBudgetExpenses(budgetId);

  const budget =
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: "Uncategorized", id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find((b) => b._id === budgetId);

  const handleDeleteBudget = () => {
    if (window.confirm(`Are you sure you want to delete the "${budget?.name}" budget? All associated expenses will be moved to Uncategorized.`)) {
      deleteBudget(budget._id);
      handleClose();
    }
  };

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div>Expenses - {budget?.name}</div>
            {budget && budget.name !== "Uncategorized" && (
              <Button
                onClick={handleDeleteBudget}
                variant="outline-danger"
              >
                Delete
              </Button>
            )}
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {expenses.length === 0 ? (
          <div>No expenses for this budget yet</div>
        ) : (
          <Stack direction="vertical" gap="3">
            {expenses.map((expense) => (
              <Stack direction="horizontal" gap="2" key={expense._id}>
                <div className="me-auto fs-4">{expense.description}</div>
                <div className="fs-5">
                  {currencyFormatter.format(expense.amount)}
                </div>
                <Button
                  onClick={() => deleteExpense(expense._id)}
                  size="sm"
                  variant="outline-danger"
                >
                  &times;
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Modal.Body>
    </Modal>
  );
}