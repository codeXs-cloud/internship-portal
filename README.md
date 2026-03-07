# 🚀 Internship Portal

A robust, full-stack web application designed to help students track and manage their internship applications efficiently. Features a clean, mobile-responsive UI with role-based access control (Admin/User).
Render Here : https://internship-portal-fqy4.onrender.com/ 

## 🌟 Key Features

### 🔐 Authentication & Roles
* **Guest Mode:** Browse internships without logging in.
* **User Mode:** Sign up/Login to mark internships as "Applied" and track status.
* **Admin Mode:** Secure admin access to Add, Edit, and Delete internships directly from the UI.
* **Security:** Passwords hashed using `bcryptjs`.

### 📅 Smart Tracking & UI
* **Dynamic Badges:** Visual indicators for "Ongoing", "Ending Soon", "Expired", or "Starts [Month]".
* **Deadline Logic:** Displays deadlines in a clear "Month - Year" format; highlights urgent dates in red.
* **Interactive Filters:** * Filter by Status (Active, Applied, Expired).
    * **Smart Date Filter:** View internships active during a specific month/year range.

### 🎨 Design
* **Minimal & Responsive:** Custom CSS using a "Mobile-First" approach.
* **Custom Dialogs:** Replaced default browser alerts with professional modal popups.
* **Interactive Elements:** Hover effects, floating headers, and glassmorphism search bars.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Responsive Layout), Vanilla JavaScript (DOM Manipulation).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **Authentication:** Custom logic with Bcrypt.js.

---

## 🚀 How to Run Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/codeXs-cloud/internship-portal.git](https://github.com/codeXs-cloud/internship-portal.git)
    cd internship-portal
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Server**
    ```bash
    node server.js
    ```

4.  **Access the App**
    Open your browser and navigate to: `http://localhost:3000`

---

## 🔑 Admin Access (For Testing)
To test the Admin features (Add/Edit/Delete), create a new account with:
* **Role:** Admin
* **Passkey:** `codeXs@2004`

---

## 📬 Connect with Me

* **LinkedIn:** [Adhyan Arya](https://www.linkedin.com/in/adhyan-arya-323315332/)
* **GitHub:** [codeXs-cloud](https://github.com/codeXs-cloud)

---

<p align="center">
  Built with ❤️ by Adhyan Arya
</p>
