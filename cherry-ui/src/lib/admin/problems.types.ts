export type AdminProblemListParams = {
  keyword?: string;
  status?: number | "all";
  difficulty?: number | "all";
  page?: number;
  size?: number;
};
