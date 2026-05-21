export function getBudgetUrl(budgetId: string): string {
  const base = window.location.href.split('#')[0]
  return `${base}#/budget/${budgetId}`
}