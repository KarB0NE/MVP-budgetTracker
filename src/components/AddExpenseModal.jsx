import { Form, Modal, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import {
  useBudgets,
  UNCATEGORIZED_BUDGET_ID,
} from "../contexts/BudgetsContext";

export default function AddExpenseModal({ show, handleClose, defaultBudgetId }) {
  const descriptionRef = useRef();
  const amountRef = useRef();
  const budgetIdRef = useRef();
  const { addExpense, budgets } = useBudgets();
  const [selectedBudget, setSelectedBudget] = useState(defaultBudgetId);

  useEffect(() => {
    setSelectedBudget(defaultBudgetId);
  }, [defaultBudgetId]);

  function handleSubmit(e) {
    e.preventDefault();

    // Basic input validation (add more as needed)
    if (!descriptionRef.current.value || parseFloat(amountRef.current.value) <= 0) {
      alert("Please enter a valid description and amount.");
      return;
    }

    addExpense ({
      successCB: () => handleClose(),
      errorCB: (error) => console.error("Error adding expense:", error),
      description: descriptionRef.current.value,
      amount: parseFloat(amountRef.current.value),
      budgetId: selectedBudget,
    })
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              ref={amountRef}
              type="number"
              required
              min={0}
              step={0.01}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>Budget</Form.Label>
            <Form.Select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option id={UNCATEGORIZED_BUDGET_ID}>Uncategorized</option>
              {budgets.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}