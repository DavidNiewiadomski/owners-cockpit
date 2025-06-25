
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParticleHero from '@/components/ParticleHero';

// Mock react-router-dom
const mockPush = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockPush
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: unknown) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: unknown) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: unknown) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: unknown) => <button {...props}>{children}</button>
  }
}));

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
});
