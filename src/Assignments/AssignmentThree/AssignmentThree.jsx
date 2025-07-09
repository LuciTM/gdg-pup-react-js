import React, { useState, useEffect } from "react";
import "./AssignmentThree.css";

// Step 1: Create AssignmentThree.jsx to handle fetching and displaying user data
function AssignmentThree() {
  // Step 4: State for users, loading, and error
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Use useEffect to trigger an API request when the component mounts
  useEffect(() => {
    // Step 3: Fetch user data from the API
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch user data. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="title-container">
      <h1>User List</h1>
      <p>
        Understand how to make API calls in React by fetching and displaying
        user data from an external API. This project covers using useEffect to
        trigger data fetching on mount, managing state with useState, and
        handling potential errors gracefully.
      </p>

      {/* Step 4: Show error message if fetch fails */}
      {error && <p className="loading" style={{ color: "#d32f2f" }}>{error}</p>}

      {/* Step 5: Render the list of users dynamically */}
      {loading && !error ? (
        <p className="loading">Loading...</p>
      ) : (
        !error && (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td data-label="ID">{user.id}</td>
                    <td data-label="Name">{user.name}</td>
                    <td data-label="Email">{user.email}</td>
                    <td data-label="Phone">{user.phone}</td>
                    <td data-label="Company">{user.company.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default AssignmentThree;
