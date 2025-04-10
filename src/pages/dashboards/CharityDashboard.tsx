import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../services/firebase';
import { FaHandHoldingHeart, FaUsers, FaTruck, FaCalendarAlt } from 'react-icons/fa';

const CharityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableDonations: 0,
    assignedDonations: 0,
    totalVolunteers: 0,
    upcomingPickups: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allDonations = await getDonations();
        setDonations(allDonations);
        
        // Calculate stats
        const availableDonations = allDonations.filter(d => d.status === 'approved' && !d.charity);
        const assignedDonations = allDonations.filter(d => d.charity === user?.id);
        
        setStats({
          availableDonations: availableDonations.length,
          assignedDonations: assignedDonations.length,
          totalVolunteers: 25, // Demo data
          upcomingPickups: 5 // Demo data
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleAcceptDonation = async (donationId: string) => {
    // In a real app, this would update the donation status in the database
    setDonations(prev => 
      prev.map(donation => 
        donation.id === donationId 
          ? { ...donation, charity: user?.id, status: 'assigned' } 
          : donation
      )
    );
    
    // Update stats
    setStats(prev => ({
      ...prev,
      availableDonations: prev.availableDonations - 1,
      assignedDonations: prev.assignedDonations + 1
    }));
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
      <h1 className="text-3xl font-bold mb-8">Charity Dashboard</h1>
      
      {/* Welcome Message */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaHandHoldingHeart className="h-6 w-6 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Welcome, {user?.name}! Thank you for helping reduce food waste and feed those in need.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaHandHoldingHeart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Available Donations</p>
              <p className="text-2xl font-bold">{stats.availableDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaTruck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Assigned Donations</p>
              <p className="text-2xl font-bold">{stats.assignedDonations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Volunteers</p>
              <p className="text-2xl font-bold">{stats.totalVolunteers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaCalendarAlt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Upcoming Pickups</p>
              <p className="text-2xl font-bold">{stats.upcomingPickups}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Donations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Available Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(donation => donation.status === 'approved' && !donation.charity)
                .map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.foodType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.pickupAddress}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAcceptDonation(donation.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Accept Donation
                      </button>
                    </td>
                  </tr>
                ))}
              {donations.filter(donation => donation.status === 'approved' && !donation.charity).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No available donations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Volunteer Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Volunteer Management</h2>
        <p className="text-gray-600 mb-4">
          Coordinate with volunteers for donation pickups and distribution.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Manage Volunteers
        </button>
      </div>
    </div>
  );
};

export default CharityDashboard; 