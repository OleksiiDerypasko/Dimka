# SLAE Solver

A single-page React + TypeScript application for solving systems of linear algebraic equations (SLAE) using classical direct and iterative methods.

## Features
- Solve using Cramer, Gaussian elimination, Gauss–Jordan, Gauss–Seidel, and Jacobi methods.
- Keyboard input with dynamic matrix grid and file upload in the specified academic format.
- Iterative settings (epsilon, maximum iterations) with iteration logs.
- Solution verification via residual check.
- Basic unit tests for solver functions with Vitest.

## Project setup
1. Install dependencies (node_modules are not committed):

```bash
npm install
```

2. Start the development server (exposes `npm start` for convenience):

```bash
npm start
# or
npm run dev
```

3. Run tests:

```bash
npm test
```

## File input format
```
n
<row1 coefficients...> b1
<row2 coefficients...> b2
...
<rown coefficients...> bn
```
Spaces or tabs are allowed between numbers.
