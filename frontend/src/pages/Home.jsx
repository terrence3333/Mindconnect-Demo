import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">You Are Not Alone 💚</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with peer support groups, professional counselors, healthcare providers, 
            and community organizations dedicated to mental health and wellbeing.
          </p>
          <Link to={isAuthenticated ? '/dashboard' : '/register'}>
            <Button size="large" variant="success">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Today'}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-600">
          How We Support You
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            icon="🤝"
            title="Peer Support Groups"
            description="Connect with others who understand your journey. Join support groups led by peers who have walked similar paths."
          >
            <Link to="/support">
              <Button className="w-full mt-4">Find Groups</Button>
            </Link>
          </Card>

          <Card
            icon="🏥"
            title="Healthcare Providers"
            description="Access a network of mental health professionals, hospitals, and clinics in your area."
          >
            <Link to="/resources">
              <Button className="w-full mt-4">Find Providers</Button>
            </Link>
          </Card>

          <Card
            icon="💬"
            title="Professional Counselors"
            description="Connect with licensed therapists and counselors who specialize in depression and mental health."
          >
            <Link to="/resources">
              <Button className="w-full mt-4">Find Counselors</Button>
            </Link>
          </Card>

          <Card
            icon="⛪"
            title="Community Support"
            description="Find faith-based support through local churches and community organizations."
          >
            <Link to="/resources">
              <Button className="w-full mt-4">Find Communities</Button>
            </Link>
          </Card>

          <Card
            icon="🌟"
            title="NGO Networks"
            description="Access resources from non-profit organizations dedicated to mental health advocacy and support."
          >
            <Link to="/resources">
              <Button className="w-full mt-4">Explore NGOs</Button>
            </Link>
          </Card>

          <Card
            icon="📊"
            title="Progress Tracking"
            description="Monitor your mental health journey with tools to track mood, activities, and progress over time."
          >
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button className="w-full mt-4">Track Progress</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* SDG Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">
            Supporting UN SDG 3: Good Health and Well-being
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            MindConnect is committed to ensuring healthy lives and promoting well-being 
            for all at all ages. We work towards reducing stigma, increasing access to 
            mental health services, and building resilient communities.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of people who are taking control of their mental health
          </p>
          <Link to="/register">
            <Button size="large" variant="primary">Create Free Account</Button>
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
