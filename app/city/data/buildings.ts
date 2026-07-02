type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
};

export type BuildingType =
  | "restaurant"
  | "mall"
  | "transport"
  | "utilities"
  | "cinema"
  | "hospital"
  | "school"
  | "house";

export type BuildingData = {
  name: string;
  type: BuildingType;
  spent: number;
  percent: number;
  color: string;
};

const categories: Array<{
  name: string;
  type: BuildingType;
  color: string;
}> = [
  {
    name: "Food",
    type: "restaurant",
    color: "#ef4444",
  },
  {
    name: "Shopping",
    type: "mall",
    color: "#8b5cf6",
  },
  {
    name: "Transport",
    type: "transport",
    color: "#3b82f6",
  },
  {
    name: "Bills",
    type: "utilities",
    color: "#f59e0b",
  },
  {
    name: "Entertainment",
    type: "cinema",
    color: "#ec4899",
  },
  {
    name: "Health",
    type: "hospital",
    color: "#22c55e",
  },
  {
    name: "Education",
    type: "school",
    color: "#06b6d4",
  },
  {
    name: "Rent",
    type: "house",
    color: "#64748b",
  },
];

export function getBuildings(
  expenses: Expense[],
  budget: number
): BuildingData[] {
  return categories.map((category) => {
    const spent = expenses
      .filter((expense) => expense.category === category.name)
      .reduce((total, expense) => total + expense.amount, 0);

    const percent =
      budget > 0 ? Math.round((spent / budget) * 100) : 0;

    return {
      ...category,
      spent,
      percent,
    };
  });
}