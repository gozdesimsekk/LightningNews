export const metadata = {
  title: 'Lightning News',
  description: 'No fluff, no delays—just the facts that shape your world.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
