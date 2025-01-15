import Link from 'next/link'
 
export default function NotFound() {
  return (
    <html>
      <body>
        <div>
          <h2>404</h2>
          <p>Could not find requested resource</p>
          <Link href="/">Return Home</Link>
        </div>
      </body>
    </html>
  )
}