const Error = ({ statusCode }: { statusCode: number }) => (
  <>
    <div className="h-full flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <span className="text-center">
        <h1 className="text-4xl font-black">{statusCode}</h1>
        <p className="text-lg font-medium text-gray-600">
          {statusCode == 404
            ? "Seite nicht gefunden"
            : "Unerwarteter Fehler aufgetreten"}
        </p>
      </span>
    </div>
  </>
)

export default Error
