# Smart Expense Tracker

A modern, full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js). Track your spending, set monthly budgets, and visualize your financial health with interactive charts.

## Features

- **Dashboard Overview**: At-a-glance view of total expenses, active budgets, and recent alerts.
- **Expense Tracking**: Add, edit, and delete daily expenses with categories and descriptions.
- **Budget Management**: Set monthly budget limits for specific categories (e.g., Food, Transport).
- **Pro Analytics**:
  - **Spending Analysis**: Bar charts to see spending by category.
  - **Distribution**: Pie charts for category breakdowns.
  - **Expense Trend**: Line chart showing spending over time.
  - **Budget vs Actual**: Radar chart to compare planned vs. actual spending.
- **Smart Alerts**: Get notified when you approach or exceed your budget limits.
- **Mobile-First Design**: Fully responsive UI built with Tailwind CSS.

## Tech Stack

### Client
- **React.js (Vite)**
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API requests

### Server
- **Node.js & Express**
- **MongoDB & Mongoose** for database
- **JWT** for secure authentication

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB installed locally or a MongoDB Atlas URI

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd smart-expense-tracker
    ```

2.  **Install Application Dependencies**
    The project is split into `client` and `server`.

    **Server:**
    ```bash
    cd server
    npm install
    ```

    **Client:**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  **Server Setup:**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_gemini_api_key  # Optional: For AI features
    ```

2.  **Run the App (Development):**

    Open two terminals:

    **Terminal 1 (Server):**
    ```bash
    cd server
    npm start
    ```

    **Terminal 2 (Client):**
    ```bash
    cd client
    npm run dev
    ```

## Development Notes

- **API URL**: The client is currently configured to point to the production backend (`https://smart-expense-tracker-c9xv.onrender.com`). To run locally, update `client/src/features/**/slice.js` files to use `http://localhost:5000`.

## License

MIT
