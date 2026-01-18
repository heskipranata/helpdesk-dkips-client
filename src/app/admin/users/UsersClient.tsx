"use client";

import { useState } from "react";
import UserTable from "@/app/admin/_components/UserTable";
import UserFormModal from "@/app/admin/_components/UserFormModal";
import DeleteConfirmModal from "@/app/admin/_components/DeleteConfirmModal";

type User = {
  id: string | number;
  nama: string;
  username: string;
  role: string;
  opd_id: string | number;
  nama_opd?: string;
};

type UserFormData = {
  nama: string;
  username: string;
  password?: string;
  role: string;
  opd_id: string | number;
};
export default function UsersClient({
  users: initialUsers,
}: {
  users: User[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      (user.nama_opd?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

    try {
      if (selectedUser) {
        // Update existing user
        const updateData = { ...userData, id: selectedUser.id };
        const res = await fetch(`${API_URL}/admin/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updateData),
        });

        if (res.ok) {
          setUsers(
            users.map((u) =>
              u.id === selectedUser.id
                ? { ...u, ...userData, id: selectedUser.id }
                : u,
            ),
          );
          setIsFormOpen(false);
          setSelectedUser(null);
          alert("User berhasil diubah");
        } else {
          alert("Gagal mengubah user");
        }
      } else {
        // Add new user
        const res = await fetch(`${API_URL}/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(userData),
        });

        if (res.ok) {
          const newUser = await res.json();
          setUsers([...users, newUser]);
          setIsFormOpen(false);
          setSelectedUser(null);
          alert("User berhasil ditambah");
        } else {
          alert("Gagal menambah user");
        }
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

      try {
        const res = await fetch(`${API_URL}/admin/users/${userToDelete.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setUsers(users.filter((u) => u.id !== userToDelete.id));
          alert("User berhasil dihapus");
        } else {
          alert("Gagal menghapus user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Terjadi kesalahan saat menghapus user");
      } finally {
        setIsDeleteOpen(false);
        setUserToDelete(null);
      }
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <input
            type="text"
            placeholder="Cari nama OPD atau username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-80 text-gray-700"
          />
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 font-medium"
        >
          + Tambah User
        </button>
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      <UserFormModal
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitUser}
      />

      <DeleteConfirmModal
        user={userToDelete}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
