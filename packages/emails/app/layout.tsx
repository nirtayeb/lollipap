import ResponsiveAppBar from "../comps/ResponsiveAppBar";

export const metadata = {
    title: 'Home',
    description: 'Welcome to Next.js',
  };
  

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </head>
        <body>
          <ResponsiveAppBar />
          {children}
        </body>
      </html>
    );
  }
  