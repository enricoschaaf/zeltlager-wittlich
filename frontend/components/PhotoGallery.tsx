import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { Title } from "./Title"

async function getPhotos(_key: "photos", cursor: string) {
  const { data } = await axios.get(
    "/api/photos" + (cursor ? `?cursor=${cursor}` : ""),
  )
  return data
}

export const PhotoGallery = () => {
  const [firstColPhotos, setFirstColPhotos] = useState([])
  const [secondColPhotos, setSecondColPhotos] = useState([])
  const [thirdColPhotos, setThirdColPhotos] = useState([])
  const { status, data, fetchMore, canFetchMore } = useInfiniteQuery(
    "photos",
    getPhotos,
    {
      getFetchMore: ({ cursor }) => cursor,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  const twoColsHeight = useRef([0, 0])
  const threeColsHeight = useRef([0, 0, 0])

  useEffect(() => {
    if (data) {
      if (matchMedia("(min-width: 1024px)").matches) {
        data[data.length - 1].photos.map(photo => {
          const minValue = Math.min(...threeColsHeight.current)
          const index = threeColsHeight.current.indexOf(minValue)

          if (index === 0) {
            setFirstColPhotos(previousState => [...previousState, photo])
            threeColsHeight.current[index] += photo.height
          } else if (index === 1) {
            setSecondColPhotos(previousState => [...previousState, photo])
            threeColsHeight.current[index] += photo.height
          } else if (index === 2) {
            setThirdColPhotos(previousState => [...previousState, photo])
            threeColsHeight.current[index] += photo.height
          }
        })
      } else if (matchMedia("(min-width: 640px)").matches) {
        data[data.length - 1].photos.map(photo => {
          const minValue = Math.min(...twoColsHeight.current)
          const index = twoColsHeight.current.indexOf(minValue)

          if (index === 0) {
            setFirstColPhotos(previousState => [...previousState, photo])
            twoColsHeight.current[index] += photo.height
          } else {
            setSecondColPhotos(previousState => [...previousState, photo])
            twoColsHeight.current[index] += photo.height
          }
        })
      } else {
        setFirstColPhotos(previousState => [
          ...previousState,
          ...data[data.length - 1].photos,
        ])
      }
    }
  }, [data])

  return (
    <>
      <Title title="Fotos" />
      {status === "success" ? (
        <div className="sm:p-6 grid sm:grid-cols-2 lg:grid-cols-3 col-gap-6">
          {firstColPhotos.length > 0 && (
            <div className="space-y-6">
              {firstColPhotos.map(({ key, src, alt, width, height }) => (
                <img
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  onLoad={canFetchMore ? () => fetchMore() : undefined}
                />
              ))}
            </div>
          )}
          {secondColPhotos.length > 0 && (
            <div className="space-y-6">
              {secondColPhotos.map(({ key, src, alt, width, height }) => (
                <img
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  onLoad={canFetchMore ? () => fetchMore() : undefined}
                />
              ))}
            </div>
          )}
          {thirdColPhotos.length > 0 && (
            <div className="space-y-6">
              {thirdColPhotos.map(({ key, src, alt, width, height }) => (
                <img
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  onLoad={canFetchMore ? () => fetchMore() : undefined}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
