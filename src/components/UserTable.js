import React, { useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import RegisterForm from "./RegisterForm";
import "../styles/table.css";

function UserTable({ users, currentUser, onRefresh, onUserUpdate, onLogout }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleAddSuccess = () => {
    setShowAddModal(false);
    onRefresh();
  };

  const handleEditSuccess = (updatedUser) => {
    setShowEditModal(false);
    onUserUpdate(updatedUser);
    onRefresh();
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    onLogout();
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">All Users</h2>
        <button
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>

      <table className="user-table product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className={user._id === currentUser.id ? "own-row" : ""}
            >
              <td className="id-cell">{user._id}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString("en-US", {
                     timeZone: "Asia/Yangon",
                      year: "numeric",
                      month: "short",
                     day: "numeric",
                      })}</td>
              <td>
                {user._id === currentUser.id ? (
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(user)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="protected-text">Protected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <RegisterForm onRegisterSuccess={handleAddSuccess} />
          </div>
        </div>
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onSuccess={handleEditSuccess}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          onSuccess={handleDeleteSuccess}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default UserTable;