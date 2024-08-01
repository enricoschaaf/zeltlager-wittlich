import { confirmSignIn } from "actions/confirmSignIn"

export const Confirm = async ({ confirm }: { confirm: string }) => {
  const { status } = await confirmSignIn({ confirm })

  return (
    <>
      <div className="h-full flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <span className="text-center">
          <h1 className="text-4xl font-black">
            {status === "error"
              ? "Magischer Link abgelaufen"
              : "Sie sind angemeldet"}
          </h1>
          <br />
          <p className="text-lg font-medium text-gray-600">
            {status === "error" ? (
              <>
                Gehen Sie zurück zu Ihrem ursprünglichen Tab und fordern Sie
                einen neuen Link an.
                <br />
                Sie können diesen Tab jetzt schließen.
              </>
            ) : (
              <>
                Gehen Sie zurück zu Ihrem ursprünglichen Tab.
                <br />
                Sie können diesen Tab jetzt schließen.
              </>
            )}
          </p>
        </span>
      </div>
    </>
  )
}
