
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
import ParticleHero from '@/components/ParticleHero';

// Mock react-router-dom
const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockPush
}));

// Mock @react-three/fiber and @react-three/drei
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: jest.fn()
}));

jest.mock('@react-three/drei', () => ({
  Stars: () => <div data-testid="stars" />,
  Float: ({ children }: { children: React.ReactNode }) => <div data-testid="float">{children}</div>
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}));

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('ParticleHero', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero content correctly', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    expect(screen.getByText('Owners Cockpit')).toBeInTheDocument();
    expect(screen.getByText(/Your AI-powered construction management platform/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument();
  });

  it('renders Three.js canvas', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('stars')).toBeInTheDocument();
  });

  it('handles Get Started button click', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    const getStartedButton = screen.getByRole('button', { name: 'Get Started' });
    fireEvent.click(getStartedButton);

    expect(mockPush).toHaveBeenCalledWith('/app');
  });

  it('handles Learn More button click', async () => {
    // Create a mock features section
    const featuresSection = document.createElement('section');
    featuresSection.id = 'features';
    featuresSection.scrollIntoView = jest.fn();
    document.body.appendChild(featuresSection);

    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    const learnMoreButton = screen.getByRole('button', { name: 'Learn More' });
    fireEvent.click(learnMoreButton);

    await waitFor(() => {
      expect(featuresSection.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    // Cleanup
    document.body.removeChild(featuresSection);
  });

  it('handles arrow button click for scroll', async () => {
    const featuresSection = document.createElement('section');
    featuresSection.id = 'features';
    featuresSection.scrollIntoView = jest.fn();
    document.body.appendChild(featuresSection);

    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    const arrowButton = screen.getByRole('button', { name: 'Scroll to features' });
    fireEvent.click(arrowButton);

    await waitFor(() => {
      expect(featuresSection.scrollIntoView).toHaveBeenCalled();
    });

    document.body.removeChild(featuresSection);
  });

  it('renders features section', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    expect(screen.getByText('Intelligent Construction Management')).toBeInTheDocument();
    expect(screen.getByText('Lifecycle Coverage')).toBeInTheDocument();
    expect(screen.getByText('Role-Aware AI')).toBeInTheDocument();
    expect(screen.getByText('Voice Commands')).toBeInTheDocument();
  });

  it('ensures accessibility requirements', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    const getStartedButton = screen.getByRole('button', { name: 'Get Started' });
    const learnMoreButton = screen.getByRole('button', { name: 'Learn More' });
    const arrowButton = screen.getByRole('button', { name: 'Scroll to features' });

    // Check minimum height for touch targets
    expect(getStartedButton).toHaveClass('min-h-[44px]');
    expect(learnMoreButton).toHaveClass('min-h-[44px]');
    expect(arrowButton).toHaveClass('min-h-[44px]');

    // Check aria-label on arrow button
    expect(arrowButton).toHaveAttribute('aria-label', 'Scroll to features');
  });

  it('handles responsive design classes', () => {
    render(
      <TestWrapper>
        <ParticleHero />
      </TestWrapper>
    );

    const heroTitle = screen.getByText('Owners Cockpit');
    expect(heroTitle).toHaveClass('text-4xl', 'sm:text-7xl');
  });
});
