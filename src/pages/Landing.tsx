import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, BarChart3, Users, Shield } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Building,
      title: "Project Management",
      description: "Comprehensive oversight of all construction projects from planning to completion."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Advanced reporting and analytics to track performance and make data-driven decisions."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Streamlined communication and collaboration tools for all stakeholders."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security and compliance features for sensitive project data."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Owners Cockpit
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate construction management platform for enterprise owners and stakeholders.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => window.location.href = '/'}>
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage construction projects
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your construction management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of construction professionals who trust Owners Cockpit.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/'}>
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
