import React from 'react';

export const Link = ({ to, children, ...props }: any) => {
  const href = typeof to === 'string' ? to : '#';
  return <a href={href} {...props}>{children}</a>;
};

export const useLocation = () => ({ pathname: typeof window !== 'undefined' ? window.location.pathname : '' });
export const useHref = (to: string) => to;
export const useNavigate = () => (path: string) => { if (typeof window !== 'undefined') window.location.href = path; };
export const BrowserRouter = ({ children }: any) => <>{children}</>;
export const Routes = ({ children }: any) => <>{children}</>;
export const Route = ({ element }: any) => <>{element}</>;
export const HashLink = ({ to, children, ...props }: any) => <a href={to} {...props}>{children}</a>;
