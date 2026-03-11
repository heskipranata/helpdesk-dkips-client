"use client";

import { useMemo, useState } from "react";
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

type ApiResult = {
  ok: boolean;
  status: number;
  statusText: string;
  message: string;
  data?: any;
};

export default function UsersClient({
  users: initialUsers,
}: {
  users: User[];
}) {
  const apiOrigin = (
    process.env.NEXT_PUBLIC_API_ORIGIN ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001"
  ).replace(/\/$/, "");
  const apiPrefix = apiOrigin.endsWith("/api") ? apiOrigin : `${apiOrigin}/api`;

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const normalizedUsers = useMemo(
    () =>
      users.map((user) => {
        const rawUser = user as User & {
          name?: string;
          opd_nama?: string;
          nama_instansi?: string;
        };

        return {
          ...user,
          nama: rawUser.nama ?? rawUser.name ?? "",
          nama_opd:
            rawUser.nama_opd ?? rawUser.opd_nama ?? rawUser.nama_instansi ?? "",
        };
      }),
    [users],
  );

  const filteredUsers = normalizedUsers.filter(
    (user) =>
      (user.nama?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
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

  const requestWithFallback = async (
    urls: string[],
    init: RequestInit,
  ): Promise<ApiResult> => {
    let lastStatus = 0;
    let lastStatusText = "";
    let lastMessage = "";

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          credentials: "include",
          ...init,
        });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        if (res.ok) {
          return {
            ok: true,
            status: res.status,
            statusText: res.statusText,
            message: "",
            data,
          };
        }

        lastStatus = res.status;
        lastStatusText = res.statusText;
        lastMessage =
          data?.message ?? data?.error ?? data?.errors?.[0]?.msg ?? "";
      } catch {
        // Try next URL
      }
    }

    return {
      ok: false,
      status: lastStatus,
      statusText: lastStatusText,
      message: lastMessage,
    };
  };

  const handleSubmitUser = async (userData: UserFormData) => {
    const userCollectionUrls = [
      `${apiPrefix}/admin/users`,
      `${apiPrefix}/users`,
    ];

    try {
      if (selectedUser) {
        const updatePayload = { ...userData };
        const updateUrls = userCollectionUrls.map(
          (baseUrl) => `${baseUrl}/${selectedUser.id}`,
        );

        const result = await requestWithFallback(updateUrls, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (result?.ok) {
          const updated =
            result.data && typeof result.data === "object" ? result.data : null;
          setUsers(
            users.map((u) =>
              u.id === selectedUser.id
                ? {
                    ...u,
                    ...updatePayload,
                    ...(updated ?? {}),
                    id: selectedUser.id,
                  }
                : u,
            ),
          );
          setIsFormOpen(false);
          setSelectedUser(null);
          alert("User berhasil diubah");
        } else {
          const statusInfo = result?.status
            ? ` (${result.status} ${result.statusText})`
            : "";
          alert(
            result?.message
              ? `Gagal mengubah user${statusInfo}: ${result.message}`
              : `Gagal mengubah user${statusInfo}`,
          );
        }
      } else {
        const result = await requestWithFallback(userCollectionUrls, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (result.ok) {
          const newUser =
            result.data && typeof result.data === "object"
              ? (result.data.data ?? result.data.user ?? result.data)
              : userData;
          setUsers([...users, newUser as User]);
          setIsFormOpen(false);
          setSelectedUser(null);
          alert("User berhasil ditambah");
        } else {
          const statusInfo = result.status
            ? ` (${result.status} ${result.statusText})`
            : "";
          alert(
            result.message
              ? `Gagal menambah user${statusInfo}: ${result.message}`
              : `Gagal menambah user${statusInfo}`,
          );
        }
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const deleteUrls = [
        `${apiPrefix}/admin/users/${userToDelete.id}`,
        `${apiPrefix}/users/${userToDelete.id}`,
        `${apiPrefix}/admin/user/${userToDelete.id}`,
        `${apiPrefix}/user/${userToDelete.id}`,
        `${apiPrefix}/admin/users/delete/${userToDelete.id}`,
      ];

      try {
        const result = await requestWithFallback(deleteUrls, {
          method: "DELETE",
        });

        if (result.ok) {
          setUsers(users.filter((u) => u.id !== userToDelete.id));
          alert("User berhasil dihapus");
        } else {
          const statusInfo = result.status
            ? ` (${result.status} ${result.statusText})`
            : "";
          alert(
            result.message
              ? `Gagal menghapus user${statusInfo}: ${result.message}`
              : `Gagal menghapus user${statusInfo}`,
          );
        }
      } catch {
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
            placeholder="Cari nama, nama OPD, atau username..."
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
