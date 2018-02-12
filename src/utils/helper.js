export function actionGenerator(key) {
  return {
    ACTION: key,
    SUCCESS: `${key}_SUCCESS`,
    FAILED: `${key}_FAILED`
  };
}
