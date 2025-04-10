import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Heart,
  Award,
  Bell,
  Settings
} from 'lucide-react';

interface Donation {
  _id: string;
  foodType: string;
  quantity: number;
  status: string;
  createdAt: string;
  pickupAddress: string;
  organizationName: string;
  donorType: string;
}

export default function Dashboard() {
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user || !token) return;
      
      try {
        const response = await fetch('http://localhost:5000/api/donations', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch donations');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setDonations(data.donations || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user, token]);

  const stats = [
    {
      title: 'Total Donations',
      value: donations.length,
      icon: <Package className="h-6 w-6 text-green-500" />,
      change: '+12% from last month'
    },
    {
      title: 'Active Donations',
      value: donations.filter(d => d.status === 'pending').length,
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      change: '+5% from last month'
    },
    {
      title: 'Completed Donations',
      value: donations.filter(d => d.status === 'completed').length,
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      change: '+8% from last month'
    },
    {
      title: 'Impact Score',
      value: '92%',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      change: '+3% from last month'
    }
  ];

  const recentDonations = donations.slice(0, 5);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-donation':
        navigate('/donate');
        break;
      case 'contact-support':
        navigate('/contact');
        break;
      case 'view-volunteers':
        navigate('/volunteer');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back, {user?.displayName || 'User'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md hover:shadow-lg transition-all duration-300`}>
              <Bell className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md hover:shadow-lg transition-all duration-300`}>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {stat.icon}
                </div>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {stat.title}
              </h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Donations */}
          <div className={`lg:col-span-2 p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Donations</h2>
              <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-300">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                  <div 
                    key={donation._id}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                          <Package className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{donation.foodType}</h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {donation.quantity} items
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        donation.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{donation.pickupAddress}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    No donations yet. Start by making your first donation!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => handleQuickAction('new-donation')}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                <span>New Donation</span>
              </button>
              <button 
                onClick={() => handleQuickAction('contact-support')}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Support</span>
              </button>
              <button 
                onClick={() => handleQuickAction('view-volunteers')}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                <span>View Volunteers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 