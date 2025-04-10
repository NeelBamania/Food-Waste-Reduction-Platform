import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, createDonation } from '../../services/firebase';
import { Donation } from '../../types/donation';
import { FaUtensils, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0
  });

  useEffect(() => {
    const fetchDonations = async () => {
      if (user?.id) {
        try {
          const userDonations = await getDonations({ donor: user.id });
          setDonations(userDonations);
          
          // Calculate stats
          const total = userDonations.length;
          const active = userDonations.filter(d => 
            d.status === 'pending' || d.status === 'approved'
          ).length;
          const completed = userDonations.filter(d => 
            d.status === 'completed'
          ).length;
          
          setStats({
            totalDonations: total,
            activeDonations: active,
            completedDonations: completed
          });
        } catch (error) {
          console.error('Error fetching donations:', error);
          toast.error('Failed to fetch donations');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDonations();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Donor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaUtensils className="text-2xl text-blue-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Donations</h3>
              <p className="text-3xl font-bold">{stats.totalDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaClock className="text-2xl text-yellow-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Active Donations</h3>
              <p className="text-3xl font-bold">{stats.activeDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaCheckCircle className="text-2xl text-green-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Completed Donations</h3>
              <p className="text-3xl font-bold">{stats.completedDonations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Donations Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(d => d.status === 'pending' || d.status === 'approved')
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.foodType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.quantity} {donation.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(donation.pickupTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              {donations.filter(d => d.status === 'pending' || d.status === 'approved').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No active donations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Donations Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Completed Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(d => d.status === 'completed')
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.foodType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{donation.quantity} {donation.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.completedAt 
                        ? new Date(donation.completedAt).toLocaleString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              {donations.filter(d => d.status === 'completed').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
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

export default DonorDashboard; 