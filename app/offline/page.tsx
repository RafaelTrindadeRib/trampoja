'use client'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <svg
        className="text-muted-400 mb-6 h-16 w-16"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <h1 className="text-muted-800 mb-2 text-2xl font-bold">Sem conexao</h1>
      <p className="text-muted-500 mb-6">
        Voce esta offline. Verifique sua conexao com a internet e tente
        novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-primary-500 hover:bg-primary-600 rounded-lg px-6 py-3 font-medium text-white transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  )
}
