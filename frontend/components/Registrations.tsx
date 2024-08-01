"use client"

import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { getRegistrations } from "actions/getRegistrations"
import { useAuth } from "hooks/useAuth"
import { useEffect, useState } from "react"
import Link from "next/link"

const Registrations = () => {
  const accessToken = useAuth()

  const [registrations, setRegistrations] = useState<any[]>([])

  useEffect(() => {
    if (accessToken) {
      getRegistrations(accessToken).then((registrations) => {
        if (registrations.data) {
          setRegistrations(registrations.data)
        }
      })
    }
  }, [accessToken])

  return (
    <div className="prose marker:prose-ul:text-primary-500 m-auto p-4">
      <h1 className="text-center">Anmeldungen</h1>
      <ul
        role="list"
        className="divide-y divide-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl pl-0"
      >
        {registrations.map((registration) => (
          <Link
            className="no-underline"
            key={registration.id}
            href={`/anmeldungen/${registration.id}`}
          >
            <li className="flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 my-0">
              <p className="text-md font-semibold text-gray-900">
                {registration.name}
              </p>
              <div className="my-auto">
                <ChevronRightIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default Registrations
