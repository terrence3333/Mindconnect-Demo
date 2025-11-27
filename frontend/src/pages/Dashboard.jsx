import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkInService } from '../services/checkInService';
import { supportService } from '../services/supportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { toast } from 'react-toastify';
import api from '../services/api';

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
      const statsResponse = await api.get('/users/stats');
      
      // Fetch check-ins for the last 30 days
      const checkInsResponse = await checkInService.getUserCheckIns({
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd')
      });

      // Fetch upcoming sessions
      const sessionsResponse = await supportService.getUpcomingSessions();

      if (statsResponse.data.success) setStats(statsResponse.data.data);
      if (checkInsResponse.success) setCheckIns(checkInsResponse.data.checkIns);
      if (sessionsResponse.success) setUpcomingSessions(sessionsResponse.data.appointments);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showAlert('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (checkInData) => {
    try {
      const response = await checkInService.createCheckIn(checkInData);
      
      if (response.success) {
        toast.success('Check-in saved successfully! Keep up the great work.');
        setShowCheckInModal(false);
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      toast.error('Error saving check-in. Please try again.');
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
    return <Loading text="Loading your dashboard..." />;
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
        <Card
          icon="📝"
          title="Daily Check-in"
          description="How are you feeling today? Track your mood and activities."
        >
          <Button
            onClick={() => setShowCheckInModal(true)}
            variant="primary"
            className="w-full mt-4"
          >
            Check In Today
          </Button>
        </Card>

        <Card
          icon="📅"
          title="Upcoming Sessions"
          description={upcomingSessions.length > 0 
            ? `Your next session: ${format(new Date(upcomingSessions[0]?.date), 'MMM dd, h:mm a')}`
            : "No upcoming sessions scheduled"
          }
        >
          <Button
            onClick={() => window.location.href = '/support'}
            variant="primary"
            className="w-full mt-4"
          >
            View Schedule
          </Button>
        </Card>

        <Card
          icon="🎯"
          title="Goals & Achievements"
          description="Track your mental health goals and celebrate wins."
        >
          <Button
            onClick={() => toast.info('Goals feature coming soon!')}
            variant="primary"
            className="w-full mt-4"
          >
            Manage Goals
          </Button>
        </Card>
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

// ============================================
// Stats Card Component
// ============================================
const StatsCard = ({ title, value, subtitle, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-lg p-6 text-center transition-transform hover:-translate-y-1`}>
    <h4 className="text-gray-600 text-sm font-medium mb-2">{title}</h4>
    <div className={`text-4xl font-bold ${textColor} mb-2`}>{value}</div>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

// ============================================
// Progress Bar Component
// ============================================
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

// ============================================
// Check-in Modal Component
// ============================================
const CheckInModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    mood: 5,
    activities: [],
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const newActivities = checked
        ? [...formData.activities, value]
        : formData.activities.filter(activity => activity !== value);
      
      setFormData({
        ...formData,
        activities: newActivities
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting check-in:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="📝 Daily Check-in"
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling today? (1-10)
          </label>
          <input
            type="range"
            name="mood"
            min="1"
            max="10"
            value={formData.mood}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>😢 Very Low (1)</span>
            <span className="font-bold text-lg text-blue-600">{formData.mood}</span>
            <span>😊 Excellent (10)</span>
          </div>
        </div>

        {/* Activities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What activities did you do today?
          </label>
          <div className="space-y-2">
            {[
              { value: 'exercise', label: '🏃 Exercise', emoji: '🏃' },
              { value: 'socializing', label: '👥 Socializing', emoji: '👥' },
              { value: 'selfcare', label: '💆 Self-care', emoji: '💆' },
              { value: 'therapy', label: '💬 Therapy/Counseling', emoji: '💬' },
              { value: 'meditation', label: '🧘 Meditation', emoji: '🧘' },
              { value: 'other', label: '✨ Other', emoji: '✨' }
            ].map(activity => (
              <label key={activity.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="activities"
                  value={activity.value}
                  checked={formData.activities.includes(activity.value)}
                  onChange={handleChange}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{activity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="How was your day? Any thoughts or feelings you'd like to record?"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            className="flex-1"
          >
            Save Check-in
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Dashboard;

// ============================================
// ALTERNATIVE: Simpler Dashboard Version (if you want less complexity)
// ============================================
/*
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loading text="Loading your dashboard..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome back, {user?.fullName}! 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card icon="📝" title="Daily Check-in">
          <p className="text-gray-600 mb-4">Track your mood and activities</p>
          <Button onClick={() => toast.info('Check-in coming soon!')} className="w-full">
            Check In Today
          </Button>
        </Card>

        <Card icon="🤝" title="Support Groups">
          <p className="text-gray-600 mb-4">Connect with your community</p>
          <Button onClick={() => window.location.href = '/support'} className="w-full">
            View Groups
          </Button>
        </Card>

        <Card icon="📚" title="Resources">
          <p className="text-gray-600 mb-4">Find help and information</p>
          <Button onClick={() => window.location.href = '/resources'} className="w-full">
            Browse Resources
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
*/
