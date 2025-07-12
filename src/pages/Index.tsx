
import React from 'react';
import MainLayout from '@/components/MainLayout';
import MainContent from '@/components/MainContent';
import { useAppState } from '@/hooks/useAppState';

const Index = () => {
  const { activeView, selectedProject } = useAppState();
  
  return (
    <MainLayout>
      <MainContent activeView={activeView} selectedProject={selectedProject} />
    </MainLayout>
  );
};

export default Index;
