import { render, screen } from '@testing-library/react';
import { DashboardShell } from '@/components/template/layout/dashboard-shell';

// Mock the auth service
jest.mock('@/lib/auth-service', () => ({
  logoutUser: jest.fn().mockResolvedValue(true),
}));

// Mock the sidebar component
jest.mock('@/components/template/layout/dashboard-sidebar', () => ({
  DashboardSidebar: () => <div data-testid="mock-sidebar">Sidebar</div>,
}));

// Mock the sidebar UI components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle Sidebar</button>,
}));

const mockNavItems = [
  { name: 'Dashboard', href: '/admin', iconName: 'Dashboard' as const },
  { name: 'Profile', href: '/admin/profile', iconName: 'Profile' as const },
];

describe('DashboardShell Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  describe('Header rendering', () => {
    it('should render the dashboard header with system access label', () => {
      render(
        <DashboardShell navItems={mockNavItems} roleName="Admin" roleDescription="Management">
          <div>Content</div>
        </DashboardShell>
      );

      expect(screen.getByText('System Access')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render sidebar trigger button', () => {
      render(
        <DashboardShell navItems={mockNavItems} roleName="Admin" roleDescription="Management">
          <div>Content</div>
        </DashboardShell>
      );

      expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    });

    it('should render the mocked sidebar', () => {
      render(
        <DashboardShell navItems={mockNavItems} roleName="Admin" roleDescription="Management">
          <div>Content</div>
        </DashboardShell>
      );

      expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    });
  });

  describe('Children rendering', () => {
    it('should render children content correctly', () => {
      render(
        <DashboardShell navItems={mockNavItems} roleName="Admin" roleDescription="Management">
          <div data-testid="child-content">Test Content</div>
        </DashboardShell>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Authenticated user', () => {
    const mockUser = {
      name: 'Admin User',
      email: 'admin@emobo.com',
      role: 'ADMIN',
      image: null,
    };

    it('should render profile dropdown trigger when user is logged in', () => {
      (window.localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'emobo-user') return JSON.stringify(mockUser);
        return null;
      });

      render(
        <DashboardShell navItems={mockNavItems} roleName="Admin" roleDescription="Management">
          <div>Content</div>
        </DashboardShell>
      );

      // The profile dropdown should contain the user's initial
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });
});
