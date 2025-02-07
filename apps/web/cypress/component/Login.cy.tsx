import Login from '../../src/app/login/page';
import { AppRouterProvider } from './../../cypress/support/test.utils';
import { mount } from 'cypress/react';

describe('Login Component', () => {
  // Setup mock router before each test
  beforeEach(() => {
    const router = {
      push: cy.stub().as('routerPush'), // Mock the router.push method
      prefetch: cy.stub().resolves(), // Mock prefetch method
      route: '/',
      pathname: '/',
    };

    // Mock Next.js useRouter hook with our mock router
    cy.stub(require('next/navigation'), 'useRouter').returns(router);

    // Mount the Login component
    cy.mount(
      <AppRouterProvider>
        <Login />
      </AppRouterProvider>,
    );
  });

  // Test if all login form elements are visible
  it('should display all login form elements', () => {
    cy.get('h1').contains('EVENTASY').should('be.visible'); // Check brand name
    cy.get('h1').contains('Log in').should('be.visible'); // Check page title
    cy.get('input[type="email"]').should('be.visible'); // Check email input field
    cy.get('input[type="password"]').should('be.visible'); // Check password input field
    cy.get('button[type="submit"]').contains('Log in').should('be.visible'); // Check login button
    cy.get('a[href="/register"]').should('be.visible'); // Check register link
  });

  // Form validation tests
  describe('Form Validation', () => {
    it('should show validation errors for empty fields', () => {
      cy.get('button[type="submit"]').click(); // Try to submit an empty form
      cy.get('.text-red-500').should('have.length', 2); // Ensure there are 2 validation error messages
      cy.contains('Email is required').should('be.visible'); // Ensure email error message is visible
      cy.contains('Password is required').should('be.visible'); // Ensure password error message is visible
    });

    it('should show error for invalid email format', () => {
      cy.get('input[type="email"]').type('invalid-email'); // Enter invalid email format
      cy.get('input[type="password"]').type('password123'); // Enter valid password
      cy.get('button[type="submit"]').click(); // Submit form
      cy.contains('Invalid email address').should('be.visible'); // Ensure invalid email error is shown
    });

    it('should show error for short password', () => {
      cy.get('input[type="email"]').type('test@example.com'); // Enter valid email
      cy.get('input[type="password"]').type('12345'); // Enter short password
      cy.get('button[type="submit"]').click(); // Submit form
      cy.contains('Password must be at least 6 characters').should('be.visible'); // Ensure short password error is shown
    });
  });

  // Test for successful login
  it('should handle successful login', () => {
    // Mock the authLogin function with a successful response
    cy.window().then((win) => {
      cy.stub(win, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });

    // Fill in the form with valid credentials
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click(); // Submit form

    // Verify that the success toast message appears
    cy.get('.Toastify').contains('Log in successful!').should('be.visible');

    // Verify that router.push was called with the correct URL
    cy.get('@routerPush').should('have.been.calledWith', '/');
  });

  // Test for failed login
  it('should handle failed login', () => {
    // Mock the authLogin function with an error response
    cy.window().then((win) => {
      cy.stub(win, 'fetch').rejects({
        response: {
          data: { status: 'email or password wrong' },
        },
      });
    });

    // Fill in the form with invalid credentials
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click(); // Submit form

    // Verify that the error toast message appears
    cy.get('.Toastify').contains('Email already in use').should('be.visible');
  });

  // Test for navigation to the registration page
  it('should navigate to register page when clicking register link', () => {
    cy.get('a[href="/register"]').click(); // Click the register link

    // Verify that the link exists and the correct href is present
    cy.get('a[href="/register"]').should('have.attr', 'href', '/register');
  });
});
