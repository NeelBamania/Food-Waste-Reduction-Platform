import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, updateDonation, subscribeToDonations } from '../../services/firebase';
import { Donation } from '../../types/donation';
import { FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaInfoCircle, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';

const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [stats, setStats] = useState({
    activePickups: 0,
    completedPickups: 0,
    upcomingPickups: 0
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupDonations = async () => {
      if (user?.id) {
        try {
          // Subscribe to real-time updates
          unsubscribe = subscribeToDonations({ volunteer: user.id }, (updatedDonations) => {
            setDonations(updatedDonations);
            
            // Calculate stats
            const active = updatedDonations.filter(d => d.status === 'approved' && !d.completedAt).length;
            const completed = updatedDonations.filter(d => d.status === 'completed').length;
            const upcoming = updatedDonations.filter(d => 
              d.status === 'approved' && 
              !d.completedAt && 
              new Date(d.pickupTime) > new Date()
            ).length;
            
            setStats({
              activePickups: active,
              completedPickups: completed,
              upcomingPickups: upcoming
            });
          });
        } catch (error) {
          console.error('Error setting up donations subscription:', error);
          toast.error('Failed to fetch donations');
        } finally {
          setLoading(false);
        }
      }
    };

    setupDonations();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id]);

  const handleStartPickup = async (donationId: string) => {
    try {
      await updateDonation(donationId, { 
        status: 'in_progress',
        volunteer: user?.id,
        trackingHistory: [
          {
            status: 'in_progress',
            timestamp: new Date().toISOString(),
            notes: 'Volunteer started the pickup'
          }
        ]
      });
      
      toast.success('Pickup started successfully');
    } catch (error) {
      console.error('Error starting pickup:', error);
      toast.error('Failed to start pickup');
    }
  };

  const handleCompletePickup = async (donationId: string) => {
    try {
      await updateDonation(donationId, { 
        status: 'completed',
        completedAt: new Date().toISOString(),
        trackingHistory: [
          {
            status: 'completed',
            timestamp: new Date().toISOString(),
            notes: 'Pickup completed successfully'
          }
        ]
      });
      
      toast.success('Pickup completed successfully');
    } catch (error) {
      console.error('Error completing pickup:', error);
      toast.error('Failed to complete pickup');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <h1 className="text-3xl font-bold mb-8">Volunteer Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaTruck className="text-2xl text-blue-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Active Pickups</h3>
              <p className="text-3xl font-bold">{stats.activePickups}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaCheckCircle className="text-2xl text-green-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Completed Pickups</h3>
              <p className="text-3xl font-bold">{stats.completedPickups}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaClock className="text-2xl text-yellow-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Upcoming Pickups</h3>
              <p className="text-3xl font-bold">{stats.upcomingPickups}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Pickups Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Pickups</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(d => d.status === 'approved' && !d.completedAt)
                .map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDonation(donation)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{donation.donor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.foodType}</div>
                      <div className="text-sm text-gray-500">{donation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(donation.pickupTime)}</div>
                      <div className="text-sm text-gray-500">Expires: {formatDateTime(donation.expiryTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartPickup(donation.id);
                        }}
                      >
                        Start Pickup
                      </button>
                    </td>
                  </tr>
                ))}
              {donations.filter(d => d.status === 'approved' && !d.completedAt).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No active pickups
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* In Progress Pickups Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">In Progress Pickups</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations
                .filter(d => d.status === 'in_progress')
                .map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDonation(donation)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{donation.donorName || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">{donation.donor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.foodType}</div>
                      <div className="text-sm text-gray-500">{donation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{donation.quantity} {donation.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(donation.pickupTime)}</div>
                      <div className="text-sm text-gray-500">Expires: {formatDateTime(donation.expiryTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompletePickup(donation.id);
                        }}
                      >
                        Complete Pickup
                      </button>
                    </td>
                  </tr>
                ))}
              {donations.filter(d => d.status === 'in_progress').length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No in-progress pickups
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Pickup Details</h3>
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Donor Information</h4>
                  <p className="text-gray-600">{selectedDonation.donorName || 'Anonymous'}</p>
                  <p className="text-gray-600">{selectedDonation.donor}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Food Details</h4>
                  <p className="text-gray-600">{selectedDonation.foodType}</p>
                  <p className="text-gray-600">{selectedDonation.quantity} {selectedDonation.unit}</p>
                  <p className="text-gray-600">{selectedDonation.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Pickup Information</h4>
                  <p className="text-gray-600">
                    <FaMapMarkerAlt className="inline mr-2" />
                    {selectedDonation.pickupAddress}
                  </p>
                  <p className="text-gray-600">
                    <FaClock className="inline mr-2" />
                    Pickup: {formatDateTime(selectedDonation.pickupTime)}
                  </p>
                  <p className="text-gray-600">
                    <FaInfoCircle className="inline mr-2" />
                    Expires: {formatDateTime(selectedDonation.expiryTime)}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedDonation.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : selectedDonation.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedDonation.status}
                  </span>
                </div>
              </div>

              {selectedDonation.trackingHistory && selectedDonation.trackingHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Tracking History</h4>
                  <div className="space-y-2">
                    {selectedDonation.trackingHistory.map((track, index) => (
                      <div key={index} className="flex items-start">
                        <FaHistory className="text-gray-400 mt-1 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{track.status}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(track.timestamp)}</p>
                          {track.notes && (
                            <p className="text-sm text-gray-600">{track.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedDonation(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedDonation.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleStartPickup(selectedDonation.id);
                      setSelectedDonation(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Start Pickup
                  </button>
                )}
                {selectedDonation.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      handleCompletePickup(selectedDonation.id);
                      setSelectedDonation(null);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Complete Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard; 