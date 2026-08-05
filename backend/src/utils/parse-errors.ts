// Flattens zod issues into a { "field.path": "message" } map for 400 responses.
export const parseErrors = (issues: Array<{ path: PropertyKey[]; message: string }>) =>
  issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path.join(".")] = issue.message;
    return acc;
  }, {});
