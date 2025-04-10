import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, updateDonation } from '../../services/firebase';
import { Donation } from '../../types/donation';
import { FaUtensils, FaStore, FaHistory, FaChartBar, FaBell, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0,
    pendingApproval: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userDonations = await getDonations({ donor: user?.id });
        setDonations(userDonations);
        
        // Calculate stats
        const active = userDonations.filter(d => d.status === 'approved' && !d.completedAt).length;
        const completed = userDonations.filter(d => d.status === 'completed').length;
        const pending = userDonations.filter(d => d.status === 'pending').length;
        
        setStats({
          totalDonations: userDonations.length,
          activeDonations: active,
          completedDonations: completed,
          pendingApproval: pending
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch donations data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleCancelDonation = async (donationId: string) => {
    try {
      await updateDonation(donationId, { 
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setDonations(prev => 
        prev.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: 'cancelled', updatedAt: new Date().toISOString() } 
            : donation
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeDonations: prev.activeDonations - 1
      }));
      
      toast.success('Donation cancelled successfully');
    } catch (error) {
      console.error('Error cancelling donation:', error);
      toast.error('Failed to cancel donation');
    }
  };

  const handleCreateNewDonation = () => {
    navigate('/donate');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <button 
          onClick={handleCreateNewDonation}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaUtensils className="mr-2" /> Create New Donation
        </button>
      </div>
      
      {/* Welcome Message */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaStore className="h-6 w-6 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Welcome, {user?.name}! Thank you for helping reduce food waste in your community.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaUtensils className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Donations</p>
              <p className="text-2xl font-bold">{stats.totalDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaBell className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold">{stats.pendingApproval}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Donations</p>
              <p className="text-2xl font-bold">{stats.activeDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaHistory className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Completed Donations</p>
              <p className="text-2xl font-bold">{stats.completedDonations}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Active Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(donation => donation.status === 'approved' && !donation.completedAt)
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodType}</div>
                      <div className="text-sm text-gray-500">{donation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(donation.pickupTime).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires: {new Date(donation.expiryTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleCancelDonation(donation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              {donations.filter(donation => donation.status === 'approved' && !donation.completedAt).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No active donations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pending Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Approval</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(donation => donation.status === 'pending')
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodType}</div>
                      <div className="text-sm text-gray-500">{donation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(donation.pickupTime).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expires: {new Date(donation.expiryTime).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleCancelDonation(donation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
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
      
      {/* Completed Donations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Completed Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(donation => donation.status === 'completed')
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.foodType}</div>
                      <div className="text-sm text-gray-500">{donation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.charity || 'Not assigned'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {donation.completedAt ? new Date(donation.completedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {donation.rating ? (
                          <>
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm text-gray-900">{donation.rating}/5</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Not rated</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              {donations.filter(donation => donation.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No completed donations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 