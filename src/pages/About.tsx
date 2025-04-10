import { useTheme } from '../contexts/ThemeContext';
import { Heart, Users, Leaf, Target, Award, Handshake } from 'lucide-react';

export default function About() {
  const { theme } = useTheme();

  const stats = [
    { number: '10K+', label: 'Lives Impacted' },
    { number: '500+', label: 'Partner Organizations' },
    { number: '50K+', label: 'Meals Donated' },
    { number: '100+', label: 'Cities Covered' },
  ];

  const values = [
    {
      icon: <Heart className="h-12 w-12 text-green-500" />,
      title: 'Compassion',
      description: 'We believe in the power of empathy and kindness to create lasting change in our communities.'
    },
    {
      icon: <Users className="h-12 w-12 text-green-500" />,
      title: 'Community',
      description: 'Building strong relationships and partnerships to maximize our impact and reach.'
    },
    {
      icon: <Leaf className="h-12 w-12 text-green-500" />,
      title: 'Sustainability',
      description: 'Promoting environmental consciousness through responsible food management.'
    },
    {
      icon: <Target className="h-12 w-12 text-green-500" />,
      title: 'Innovation',
      description: 'Continuously improving our platform to better serve our community.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6 text-white">About Us</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            We're on a mission to reduce food waste and help those in need through our innovative platform.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-green-50 dark:bg-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Founded in 2023, our platform emerged from a simple observation: while many people go hungry,
                perfectly good food is being wasted. We set out to bridge this gap by creating a technology-driven
                solution that connects food donors with those in need.
              </p>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Today, we're proud to be at the forefront of food waste reduction, working with restaurants,
                grocery stores, and individuals to make a real difference in our communities.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                alt="Our Story"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } shadow-lg transform hover:-translate-y-2 transition-all duration-300`}
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg transform hover:-translate-y-2 transition-all duration-300`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Be part of the solution to food waste and hunger. Start donating or volunteering today.
          </p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-green-50 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}