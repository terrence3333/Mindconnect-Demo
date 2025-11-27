import React from 'react';
import Card from '../components/common/Card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          About MindConnect
        </h1>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            MindConnect is dedicated to supporting individuals experiencing depression by 
            connecting them with comprehensive mental health resources, peer support, and 
            professional care. We believe that no one should face mental health challenges alone.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Supporting SDG 3</h2>
          <p className="text-gray-700 mb-4">
            Our platform directly contributes to the United Nations Sustainable Development 
            Goal 3: Good Health and Well-being by:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Ensuring access to mental health services for all</li>
            <li>Reducing stigma around mental health</li>
            <li>Promoting mental health awareness and education</li>
            <li>Connecting individuals with appropriate care and support</li>
            <li>Building resilient communities that support mental wellness</li>
          </ul>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card icon="🤝" title="Community-Centered">
            <p className="text-gray-600">
              We connect people with local support systems including peers, healthcare 
              providers, and community organizations.
            </p>
          </Card>

          <Card icon="🔒" title="Privacy First">
            <p className="text-gray-600">
              Your mental health information is protected with the highest standards 
              of privacy and security.
            </p>
          </Card>

          <Card icon="🌍" title="Accessible">
            <p className="text-gray-600">
              Free to use and designed to be accessible to all, regardless of economic 
              status or location.
            </p>
          </Card>

          <Card icon="📱" title="User-Friendly">
            <p className="text-gray-600">
              Simple, intuitive design that makes finding help and tracking progress 
              easy and stress-free.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
