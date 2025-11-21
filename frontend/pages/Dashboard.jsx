import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkInService } from '../services/checkInService';
import { supportService } from '../services/supportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import CheckInModal from '../components/checkin/CheckInModal';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    daysJoined: 0,
    connections: 0,
    checkIns: 0,
    resourcesUsed: 0
  });
  const [checkIns, setCheckIns] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const statsResponse = await fetch(`${process.env.REACT_APP_API_URL}/users/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();

      // Fetch check-ins for the last 30 days
      const checkInsResponse = await checkInService.getUserCheckIns({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
      });

      // Fetch upcoming sessions
      const sessionsResponse = await supportService.getUpcomingSessions();

      if (statsData.success) setStats(statsData.data);
      if (checkInsResponse.success) setCheckIns(checkInsResponse.data);
      if (sessionsResponse.success) setUpcomingSessions(sessionsResponse.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showAlert('Error loading dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (checkInData) => {
    try {
      const response = await checkInService.createCheckIn(checkInData);
      
      if (response.success) {
        showAlert('Check-in saved successfully! Keep up the great work.', 'success');
        setShowCheckInModal(false);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      showAlert('Error saving check-in. Please try again.', 'danger');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Prepare mood chart data
  const moodChartData = checkIns.map(checkIn => ({
    date: format(new Date(checkIn.date), 'MMM dd'),
    mood: checkIn.mood
  })).reverse();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ show: false })} />
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.fullName || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's your mental health journey overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Days Since Joining"
          value={stats.daysJoined}
          subtitle="Keep going strong! 💪"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatsCard
          title="Support Connections"
          value={stats.connections}
          subtitle="Groups, counselors, resources"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatsCard
          title="Check-ins This Month"
          value={stats.checkIns}
          subtitle="Great consistency! ⭐"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatsCard
          title="Resources Accessed"
          value={stats.resourcesUsed}
          subtitle="Exploring available help"
          bgColor="bg-pink-50"
          textColor="text-pink-600"
        />
      </div>

      {/* Mood Trend Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mood Trends (Last 30 Days)</h2>
        {moodChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#4a90e2" 
                strokeWidth={2}
                dot={{ fill: '#4a90e2', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No mood data yet. Start tracking your mood today!
          </p>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ActionCard
          icon="📝"
          title="Daily Check-in"
          description="How are you feeling today? Track your mood and activities."
          buttonText="Check In Today"
          onClick={() => setShowCheckInModal(true)}
        />
        <ActionCard
          icon="📅"
          title="Upcoming Sessions"
          description={upcomingSessions.length > 0 
            ? `Your next session: ${format(new Date(upcomingSessions[0]?.date), 'MMM dd, h:mm a')}`
            : "No upcoming sessions scheduled"
          }
          buttonText="View Schedule"
          onClick={() => window.location.href = '/support'}
        />
        <ActionCard
          icon="🎯"
          title="Goals & Achievements"
          description="Track your mental health goals and celebrate wins."
          buttonText="Manage Goals"
          onClick={() => window.location.href = '/goals'}
        />
      </div>

      {/* Progress Tracking */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Wellness Goals</h2>
        
        <ProgressBar
          label="Daily Check-ins"
          current={stats.checkIns}
          goal={30}
          unit="days"
        />
        
        <ProgressBar
          label="Support Group Participation"
          current={6}
          goal={8}
          unit="sessions"
        />
        
        <ProgressBar
          label="Self-Care Activities"
          current={18}
          goal={20}
          unit="planned"
        />
      </div>

      {/* Check-in Modal */}
      {showCheckInModal && (
        <CheckInModal
          onClose={() => setShowCheckInModal(false)}
          onSubmit={handleCheckInSubmit}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, subtitle, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-lg p-6 text-center`}>
    <h4 className="text-gray-600 text-sm font-medium mb-2">{title}</h4>
    <div className={`text-4xl font-bold ${textColor} mb-2`}>{value}</div>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// Action Card Component
const ActionCard = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4">{description}</p>
    <button
      onClick={onClick}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ label, current, goal, unit }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{label}</span>
        <span>{current}/{goal} {unit}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
