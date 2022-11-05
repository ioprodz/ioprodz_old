/* eslint-disable indent */
export const mockModule = (importPath: string, overrides: any) => {
  jest.mock(importPath, () => {
    const module = jest.requireActual(importPath);
    const hasDefaultExport = !!module.default;
    const overridedModule = hasDefaultExport
      ? {
          default: { ...module.default, ...overrides },
        }
      : {
          ...module,
          ...overrides,
        };
    return {
      __esModule: true,
      ...overridedModule,
    };
  });
};
