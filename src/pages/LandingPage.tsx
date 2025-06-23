
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from '@/hooks/useRouter';
import { Building2, BarChart3, Users, Shield } from 'lucide-react';
import MotionWrapper from '@/components/MotionWrapper';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <MotionWrapper animation="fadeIn">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Construction Intelligence Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Streamline your construction projects with AI-powered insights, real-time collaboration, 
              and comprehensive project management tools designed for modern construction teams.
            </p>
            <Button 
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Get Started
            </Button>
          </div>
        </MotionWrapper>

        {/* Features Grid */}
        <MotionWrapper animation="slideUp" delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Project Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive project tracking and management tools
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered analytics for better decision making
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time collaboration tools for your entire team
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safety & Compliance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ensure safety standards and regulatory compliance
              </p>
            </Card>
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
};

export default LandingPage;
