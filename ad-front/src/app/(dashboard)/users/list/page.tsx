"use client";

import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@/assets/icons";
import { Checkbox } from "@/components/FormElements/checkbox";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "blocked";
  registrationDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
  date: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        status: "active",
        registrationDate: "2024-01-15",
        lastLogin: "2024-01-20",
        totalOrders: 5,
        totalSpent: 299.99,
        avatar: "/images/user/user-01.png",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 987-6543",
        status: "active",
        registrationDate: "2024-01-10",
        lastLogin: "2024-01-19",
        totalOrders: 3,
        totalSpent: 149.50,
        avatar: "/images/user/user-02.png",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+1 (555) 456-7890",
        status: "inactive",
        registrationDate: "2023-12-20",
        lastLogin: "2024-01-05",
        totalOrders: 1,
        totalSpent: 79.99,
        avatar: "/images/user/user-03.png",
      },
      {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        phone: "+1 (555) 789-0123",
        status: "blocked",
        registrationDate: "2023-11-15",
        lastLogin: "2024-01-01",
        totalOrders: 0,
        totalSpent: 0,
        avatar: "/images/user/user-04.png",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleViewOrders = (user: User) => {
    setSelectedUser(user);
    // Mock orders data for the selected user
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-001",
        status: "delivered",
        total: 99.99,
        items: 3,
        date: "2024-01-18",
      },
      {
        id: "2",
        orderNumber: "ORD-002",
        status: "shipped",
        total: 149.50,
        items: 2,
        date: "2024-01-20",
      },
      {
        id: "3",
        orderNumber: "ORD-003",
        status: "pending",
        total: 79.99,
        items: 1,
        date: "2024-01-21",
      },
    ];
    setUserOrders(mockOrders);
    setShowOrdersModal(true);
  };

  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId);
    // TODO: Navigate to edit page or open edit modal
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      console.log("Delete user:", userId);
      // TODO: Implement delete API call
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus as User['status'] } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 2xl:p-10 bg-white dark:bg-[#122031] min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your user accounts and view their orders</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary sm:w-80"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <g clipPath="url(#clip0_1699_11536)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.625 2.0625C5.00063 2.0625 2.0625 5.00063 2.0625 8.625C2.0625 12.2494 5.00063 15.1875 8.625 15.1875C12.2494 15.1875 15.1875 12.2494 15.1875 8.625C15.1875 5.00063 12.2494 2.0625 8.625 2.0625ZM0.9375 8.625C0.9375 4.37931 4.37931 0.9375 8.625 0.9375C12.8707 0.9375 16.3125 4.37931 16.3125 8.625C16.3125 10.5454 15.6083 12.3013 14.4441 13.6487L16.8977 16.1023C17.1174 16.3219 17.1174 16.6781 16.8977 16.8977C16.6781 17.1174 16.3219 17.1174 16.1023 16.8977L13.6487 14.4441C12.3013 15.6083 10.5454 16.3125 8.625 16.3125C4.37931 16.3125 0.9375 12.8707 0.9375 8.625Z"
                  />
                </g>
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-strokedark">
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Orders
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || "/images/user/user-01.png"}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/user/user-01.png";
                          }}
                        />
                        <div>
                          <div className="font-medium text-black dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {new Date(user.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-black dark:text-white">{user.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      {user.totalOrders}
                    </td>
                    <td className="px-6 py-4 text-black dark:text-white">
                      ${user.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrders(user)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="View Orders"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="rounded p-1 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                          title="Edit"
                        >
                          <PencilSquareIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                No users found matching your criteria.
              </div>
            </div>
          )}
        </div>

        {/* Orders Modal */}
        {showOrdersModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Orders for {selectedUser.name}
                </h2>
                <button
                  onClick={() => setShowOrdersModal(false)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
                    <div className="text-lg font-semibold text-black dark:text-white">
                      {selectedUser.totalOrders}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
                    <div className="text-lg font-semibold text-black dark:text-white">
                      ${selectedUser.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <div className="text-lg font-semibold text-black dark:text-white">
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
                    <div className="text-lg font-semibold text-black dark:text-white">
                      {new Date(selectedUser.lastLogin).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-strokedark">
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Order #
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 text-black dark:text-white">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 text-black dark:text-white">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getOrderStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-black dark:text-white">
                          {order.items}
                        </td>
                        <td className="px-4 py-3 text-black dark:text-white">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => console.log("View order details:", order.id)}
                            className="rounded bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-opacity-90"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {userOrders.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No orders found for this user.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 