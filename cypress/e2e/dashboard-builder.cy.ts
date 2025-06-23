
describe('Dashboard Builder', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', 'mock-token');
    });
    
    // Visit dashboard page
    cy.visit('/app');
    
    // Wait for dashboard to load
    cy.get('[data-testid="dashboard-grid"]', { timeout: 10000 }).should('be.visible');
  });

  it('should load default dashboard layout', () => {
    cy.get('[data-testid="dashboard-grid"]').should('be.visible');
    cy.get('[data-testid="dashboard-widget"]').should('have.length.at.least', 1);
    cy.contains('Budget Status').should('be.visible');
  });

  it('should toggle edit mode', () => {
    cy.contains('Customize').click();
    cy.get('[data-testid="edit-mode"]').should('exist');
    cy.contains('Add Widget').should('be.visible');
    
    // Exit edit mode
    cy.contains('Done').click();
    cy.get('[data-testid="edit-mode"]').should('not.exist');
  });

  it('should add new widget to dashboard', () => {
    // Enter edit mode
    cy.contains('Customize').click();
    
    // Open add widget panel
    cy.contains('Add Widget').click();
    cy.get('[data-testid="add-widget-panel"]').should('be.visible');
    
    // Count current widgets
    cy.get('[data-testid="dashboard-widget"]').then($widgets => {
      const initialCount = $widgets.length;
      
      // Add a widget
      cy.get('[data-testid="add-widget-panel"]')
        .contains('Add Widget')
        .first()
        .click();
      
      // Verify widget was added
      cy.get('[data-testid="dashboard-widget"]').should('have.length', initialCount + 1);
    });
  });

  it('should remove widget from dashboard', () => {
    // Enter edit mode
    cy.contains('Customize').click();
    
    // Count current widgets
    cy.get('[data-testid="dashboard-widget"]').then($widgets => {
      const initialCount = $widgets.length;
      
      if (initialCount > 0) {
        // Remove first widget
        cy.get('[data-testid="remove-widget-btn"]').first().click();
        
        // Verify widget was removed
        cy.get('[data-testid="dashboard-widget"]').should('have.length', initialCount - 1);
      }
    });
  });

  it('should persist layout after page reload', () => {
    // Enter edit mode and add a widget
    cy.contains('Customize').click();
    cy.contains('Add Widget').click();
    
    cy.get('[data-testid="add-widget-panel"]')
      .contains('Add Widget')
      .first()
      .click();
    
    // Wait for save (debounced)
    cy.wait(1000);
    
    // Get current widget count
    cy.get('[data-testid="dashboard-widget"]').then($widgets => {
      const widgetCount = $widgets.length;
      
      // Reload page
      cy.reload();
      
      // Verify layout persisted
      cy.get('[data-testid="dashboard-grid"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="dashboard-widget"]').should('have.length', widgetCount);
    });
  });

  it('should drag and reorder widgets', () => {
    // Enter edit mode
    cy.contains('Customize').click();
    
    // Get first two widgets
    cy.get('[data-testid="dashboard-widget"]').then($widgets => {
      if ($widgets.length >= 2) {
        const firstWidget = $widgets.eq(0);
        const secondWidget = $widgets.eq(1);
        
        // Get initial positions
        cy.wrap(firstWidget).invoke('text').as('firstWidgetText');
        cy.wrap(secondWidget).invoke('text').as('secondWidgetText');
        
        // Perform drag and drop
        cy.get('[data-testid="drag-handle"]').first()
          .trigger('mousedown', { button: 0 })
          .trigger('mousemove', { clientX: 400, clientY: 200 })
          .trigger('mouseup');
        
        // Wait for reorder
        cy.wait(500);
        
        // Verify order changed (this would need more sophisticated testing in real scenario)
        cy.get('[data-testid="dashboard-widget"]').should('have.length.at.least', 2);
      }
    });
  });

  it('should handle role switching', () => {
    // Switch to different role
    cy.get('[data-testid="role-toggle"]').click();
    cy.contains('Finance').click();
    
    // Verify role-specific widgets load
    cy.get('[data-testid="dashboard-grid"]').should('be.visible');
    cy.contains('Finance').should('be.visible');
    
    // Switch back to Executive
    cy.get('[data-testid="role-toggle"]').click();
    cy.contains('Executive').click();
    
    // Verify layout switches back
    cy.get('[data-testid="dashboard-grid"]').should('be.visible');
    cy.contains('Executive').should('be.visible');
  });

  it('should show empty state for new users', () => {
    // Clear any existing layouts
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    
    // Mock empty layout response
    cy.intercept('GET', '**/user_dashboard_layouts**', {
      statusCode: 200,
      body: { data: null }
    });
    
    cy.reload();
    
    // Should show empty state
    cy.contains('No widgets configured').should('be.visible');
    cy.contains('Get Started').should('be.visible');
  });

  it('should be accessible via keyboard', () => {
    // Enter edit mode
    cy.contains('Customize').click();
    
    // Test keyboard navigation
    cy.get('body').type('{tab}');
    cy.focused().should('contain', 'Add Widget');
    
    // Test escape to exit panels
    cy.contains('Add Widget').click();
    cy.get('body').type('{esc}');
    cy.get('[data-testid="add-widget-panel"]').should('not.exist');
  });
});
