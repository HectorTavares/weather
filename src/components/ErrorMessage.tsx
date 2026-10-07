interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message.length) {
    return null
  }

  return <div className='error-container'>{message}</div>
}
