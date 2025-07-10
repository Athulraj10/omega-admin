"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@/assets/icons";
import { Checkbox } from "@/components/FormElements/checkbox";
import { fetchUsers, fetchUserOrders, fetchUserReports, updateUserStatus, deleteUser } from "@/components/redux/action/users/userAction";
import { RootState } from "@/components/redux/reducer";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  itemCount: number;
  date: string;
}

export default function UserList() {
  const dispatch = useDispatch();
  const { users, loading, error, pagination, userOrders, userReports, ordersLoading, reportsLoading } = useSelector((state: RootState) => state.users);
  const { formatPrice } = useCurrency();
  
  // Test Redux connection
  const state = useSelector((state: RootState) => state);
  console.log('Redux State:', state?.users);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users on component mount
  useEffect(() => {
    try {
      fetchUsersData();
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsersData = () => {
    dispatch(fetchUsers({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter === 'all' ? '' : statusFilter
    }));
  };

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
    dispatch(fetchUserOrders(user.id, { page: 1, limit: 10 }));
    setShowOrdersModal(true);
  };

  const handleViewReports = (user: User) => {
    setSelectedUser(user);
    dispatch(fetchUserReports(user.id, '30'));
    setShowReportsModal(true);
  };

  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId);
    // TODO: Navigate to edit page or open edit modal
  };

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        // Ensure userId is valid before dispatching
        if (userId && typeof userId === 'string') {
          dispatch(deleteUser(userId));
        } else {
          console.error('Invalid userId for deletion:', userId);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    try {
      // Ensure both userId and newStatus are valid
      if (userId && typeof userId === 'string' && newStatus && typeof newStatus === 'string') {
        const statusMap = {
          'active': '1',
          'inactive': '0',
          'blocked': '2'
        };
        const mappedStatus = statusMap[newStatus as keyof typeof statusMap];
        if (mappedStatus) {
          dispatch(updateUserStatus(userId, mappedStatus));
        } else {
          console.error('Invalid status for user update:', newStatus);
        }
      } else {
        console.error('Invalid userId or status for update:', { userId, newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };



  // Debug logging
  console.log('UserList State:', { users, loading, error, pagination });

  // Check if Redux state is properly initialized
  if (!users || users === undefined) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 dark:text-gray-400 mb-4">Initializing...</div>
        </div>
      </div>
    );
  }

  // Filter out any undefined or null users to prevent errors
  const validUsers = users.filter(user => user && typeof user === 'object' && user.id);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">Error: {error}</div>
          <button 
            onClick={fetchUsersData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4 md:p-6 2xl:p-10 bg-white dark:bg-[#122031] min-h-screen">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark dark:text-white">Users</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your user accounts and view their orders</p>
            </div>
            <CurrencySelector />
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
              {pagination.totalUsers} total users
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
                  {validUsers.map((user) => {
                    // Additional safety check for each user
                    if (!user || typeof user !== 'object' || !user.id) {
                      console.warn('Invalid user object found:', user);
                      return null;
                    }
                    
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || "/images/user/user-01.png"}
                              alt={user.name || 'User'}
                              className="h-10 w-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/user/user-01.png";
                              }}
                            />
                            <div>
                              <div className="font-medium text-black dark:text-white">
                                {user.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Joined {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'Unknown'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-black dark:text-white">{user.email || 'No email'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.phone || 'No phone'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.status || 'inactive'}
                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium border-0 ${getStatusColor(user.status || 'inactive')}`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-black dark:text-white">
                          {user.totalOrders || 0}
                        </td>
                        <td className="px-6 py-4 text-black dark:text-white">
                          {formatPrice(user.totalSpent || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
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
                              onClick={() => handleViewReports(user)}
                              className="rounded p-1 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                              title="View Reports"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                              </svg>
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {validUsers.length === 0 && !loading && (
              <div className="py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  No users found matching your criteria.
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-strokedark">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="rounded px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="rounded px-3 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
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
                        {formatPrice(selectedUser.totalSpent)}
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
                            {order.itemCount}
                          </td>
                          <td className="px-4 py-3 text-black dark:text-white">
                            {formatPrice(order.total)}
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

          {/* Reports Modal */}
          {showReportsModal && selectedUser && userReports && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="mx-4 w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-dark dark:text-white">
                    Reports for {selectedUser.name}
                  </h2>
                  <button
                    onClick={() => setShowReportsModal(false)}
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>

                {reportsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="text-sm text-blue-600 dark:text-blue-400">Total Orders</div>
                        <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {userReports.summary.totalOrders}
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <div className="text-sm text-green-600 dark:text-green-400">Total Spent</div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {formatPrice(userReports.summary.totalSpent)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                        <div className="text-sm text-purple-600 dark:text-purple-400">Avg Order Value</div>
                        <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          ${userReports.summary.averageOrderValue.toFixed(2)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400">Min Order</div>
                        <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                          ${userReports.summary.minOrderValue.toFixed(2)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="text-sm text-red-600 dark:text-red-400">Max Order</div>
                        <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                          ${userReports.summary.maxOrderValue.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">Orders by Status</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {Object.entries(userReports.ordersByStatus).map(([status, data]) => (
                          <div key={status} className="rounded bg-white p-3 dark:bg-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                              {status}
                            </div>
                            <div className="text-lg font-semibold text-black dark:text-white">
                              {data.count} orders
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ${data.totalAmount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Trends */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">Monthly Trends</h3>
                      <div className="space-y-2">
                        {userReports.monthlyTrends.map((trend) => (
                          <div key={trend.month} className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-700">
                            <div className="text-black dark:text-white">{trend.month}</div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {trend.orders} orders
                              </span>
                              <span className="font-semibold text-black dark:text-white">
                                ${trend.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">Recent Orders</h3>
                      <div className="space-y-2">
                        {userReports.recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between rounded bg-white p-3 dark:bg-gray-700">
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="font-semibold text-black dark:text-white">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
} 