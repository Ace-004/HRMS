# HRMS Frontend - Group Project (Vite + React)

This is the frontend dashboard for the Human Resource Management System.

## 📡 API Integration (Crucial)
To communicate with the backend, all developers MUST use the centralized API service.

**Location**: `src/services/api.js`

### Why use it?
- **Auto-Auth**: It automatically grabs the JWT token from `localStorage` and injects it into every request.
- **Auto-Logout**: If a user's session expires (401 error), the interceptor automatically logs them out.
- **Simplified Data**: It unwraps the Axios response so you receive the backend's data object directly.

### Usage Example:
```javascript
import { getEmployees } from './services/api';

const MyComponent = () => {
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await getEmployees();
                if(response.success) {
                    console.log(response.data); // Array of employees!
                }
            } catch (err) {
                console.error("Failed to fetch employees", err);
            }
        };
        fetchAll();
    }, []);
}
```

## 🛠️ Setup
1.  Run `npm install`
2.  Install Axios: `npm install axios`
3.  Run `npm run dev`

**Developed by: Ayush Rana** 🚀
