import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, updateDonation } from '../../services/firebase';
import { Donation } from '../../types/donation';
import { FaUsers, FaCheckCircle, FaChartBar, FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDonations: 0,
    approvedDonations: 0,
    totalDonations: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allDonations = await getDonations();
        setDonations(allDonations);
        
        // Calculate stats
        const pendingDonations = allDonations.filter(d => d.status === 'pending');
        const approvedDonations = allDonations.filter(d => d.status === 'approved');
        
        setStats({
          totalUsers: 150, // Demo data
          pendingDonations: pendingDonations.length,
          approvedDonations: approvedDonations.length,
          totalDonations: allDonations.length
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch donations data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveDonation = async (donationId: string) => {
    try {
      await updateDonation(donationId, { status: 'approved' });
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'approved' } 
            : donation
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingDonations: prev.pendingDonations - 1,
        approvedDonations: prev.approvedDonations + 1
      }));
      
      toast.success('Donation approved successfully');
    } catch (error) {
      console.error('Error approving donation:', error);
      toast.error('Failed to approve donation');
    }
  };

  const handleRejectDonation = async (donationId: string) => {
    try {
      await updateDonation(donationId, { status: 'cancelled' });
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'cancelled' } 
            : donation
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingDonations: prev.pendingDonations - 1
      }));
      
      toast.success('Donation rejected successfully');
    } catch (error) {
      console.error('Error rejecting donation:', error);
      toast.error('Failed to reject donation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Donations</p>
              <p className="text-2xl font-bold">{stats.pendingDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Approved Donations</p>
              <p className="text-2xl font-bold">{stats.approvedDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaChartBar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Donations</p>
              <p className="text-2xl font-bold">{stats.totalDonations}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(donation => donation.status === 'pending')
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{donation.donor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.foodType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(donation.createdAt || '').toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleApproveDonation(donation.id)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDonation(donation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              {donations.filter(donation => donation.status === 'pending').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No pending donations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* User Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">
          Manage user accounts, roles, and permissions.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Manage Users
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard; 