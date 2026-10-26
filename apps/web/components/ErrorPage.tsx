import { statusPageClassNames } from './page-styles'

export function ErrorPage({
  statusCode,
  onRetry
}: {
  statusCode: number
  onRetry?: () => void
}) {
  return (
    <div className={statusPageClassNames.container}>
      <main className={statusPageClassNames.main}>
        <h1>Oops, Not Found or Deleted :(</h1>

        {statusCode && <p>Error code: {statusCode}</p>}

        {onRetry && (
          <button type='button' onClick={onRetry}>
            Try again
          </button>
        )}

        <img
          src='/error.png'
          alt='Error'
          className={statusPageClassNames.image}
        />
      </main>
    </div>
  )
}
