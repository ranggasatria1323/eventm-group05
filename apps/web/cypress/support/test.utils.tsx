import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function createRouter(params: Partial<NextRouter> = {}): NextRouter {
  return {
    push: cy.stub().as('routerPush'),
    replace: cy.stub().as('routerReplace'),
    prefetch: cy.stub().resolves(),
    back: cy.stub(),
    forward: cy.stub(),
    refresh: cy.stub(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    ...params,
  } as NextRouter;
}

export function createAppRouter() {
  return {
    back: () => {},
    forward: () => {},
    prefetch: () => Promise.resolve(),
    push: cy.stub().as('routerPush'),
    refresh: () => {},
    replace: cy.stub().as('routerReplace'),
    pathname: '/',
  };
}

interface WrapperProps {
  children: React.ReactNode;
}

export function AppRouterProvider({ children }: WrapperProps) {
  const router = createAppRouter();
  return (
    <AppRouterContext.Provider value={router}>
      {children}
    </AppRouterContext.Provider>
  );
}