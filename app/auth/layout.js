export default function AuthLayout({ children }) {
  AuthLayout.layout = false;
  return <section>{children}</section>;
}
