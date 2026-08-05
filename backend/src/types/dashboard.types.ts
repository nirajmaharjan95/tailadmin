export interface StatCount {
  total: number;
}

export interface DashboardStats {
  employees: StatCount;
  products: StatCount;
  tasks: StatCount;
  users?: StatCount;
  courses?: StatCount;
}
