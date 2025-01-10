# XPO Test

## Project Description
This project, `xpo-test`, is a React application that leverages several modern libraries and tools to build a scalable web application. The project includes a drag-and-drop feature using `@dnd-kit` and a responsive UI styled with Tailwind CSS.

---

## How to Run the Project

### Prerequisites:
Ensure that you have the following tools installed on your system:
- **Node.js** (version 14.x or later)
- **npm** (Node Package Manager) or **yarn**

### Steps to Run the Project:
1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd xpo-test
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   or using yarn:
   ```bash
   yarn start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Assumptions Made
- The project is intended to be run in a modern browser that supports ES6+.
- The project assumes that Node.js and npm/yarn are properly configured on the developer's machine.
- No special environment variables are required to run the project.

---

## Technologies and Libraries Used

### Core Dependencies:
- **[@dnd-kit/core](https://github.com/clauderic/dnd-kit)**: A lightweight drag-and-drop toolkit for React.
- **[@dnd-kit/sortable](https://github.com/clauderic/dnd-kit)**: Provides sortable drag-and-drop functionality.
- **[axios](https://axios-http.com/)**: A promise-based HTTP client for making API requests.
- **[clsx](https://github.com/lukeed/clsx)**: A utility for conditionally joining class names.
- **[lucide-react](https://github.com/lucide-icons/lucide)**: Icon components for React.
- **[react](https://reactjs.org/)**: A JavaScript library for building user interfaces.
- **[react-dom](https://reactjs.org/docs/react-dom.html)**: The package that provides DOM-specific methods for React.
- **[react-hot-toast](https://react-hot-toast.com/)**: A notification library for React.
- **[react-router-dom](https://reactrouter.com/)**: A routing library for React applications.
- **[react-scripts](https://create-react-app.dev/)**: Scripts and configuration used by Create React App.
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)**: Utility to merge Tailwind CSS classes without conflicts.

### Dev Dependencies:
- **[@babel/runtime](https://babeljs.io/)**: Runtime library for Babel.
- **[autoprefixer](https://github.com/postcss/autoprefixer)**: A PostCSS plugin to add vendor prefixes to CSS rules.
- **[postcss](https://postcss.org/)**: A tool to transform CSS with JavaScript.
- **[tailwindcss](https://tailwindcss.com/)**: A utility-first CSS framework.
- **[typescript](https://www.typescriptlang.org/)**: A typed superset of JavaScript.

---

## Scripts Available

### Start the Development Server
```bash
npm start
```
Starts the development server on `http://localhost:3000`.

### Build for Production
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Run Tests
```bash
npm test
```
Launches the test runner in the interactive watch mode.

### Eject Configuration
```bash
npm run eject
```
Ejects the app, giving full control over the configuration files. **Note:** This action is irreversible.

---

## Browserslist Configuration
The project is configured to support modern browsers as specified in the `browserslist` field in `package.json`:
- Browsers with more than 0.2% market share.
- Excluding dead browsers.
- Not supporting Internet Explorer 11 or lower.
- Excluding Opera Mini.
