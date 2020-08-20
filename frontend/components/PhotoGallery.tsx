import axios from "axios"
import { Image } from "components/Image"
import { useEffect, useRef, useState } from "react"
import { useInfiniteQuery } from "react-query"

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
  const oneCol = useRef([])
  const twoCols = useRef([[], []])
  const twoColAspectRatios = useRef([0, 0])
  const threeCols = useRef([[], [], []])
  const threeColAspectRatios = useRef([0, 0, 0])
  const { status, data, fetchMore, canFetchMore } = useInfiniteQuery(
    "photos",
    getPhotos,
    {
      getFetchMore: ({ cursor }) => cursor,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )

  useEffect(() => {
    if (data) {
      oneCol.current = []
      twoCols.current = [[], []]
      twoColAspectRatios.current = [0, 0]
      threeCols.current = [[], [], []]
      threeColAspectRatios.current = [0, 0, 0]
      data
        .map(({ photos }) => photos)
        .flat()
        .map(photo => {
          const threeColMinValue = Math.min(...threeColAspectRatios.current)
          const threeColIndex = threeColAspectRatios.current.indexOf(
            threeColMinValue,
          )
          threeCols.current[threeColIndex].push(photo)
          threeColAspectRatios.current[threeColIndex] +=
            photo.height / photo.width

          const twoColMinValue = Math.min(...twoColAspectRatios.current)
          const twoColIndex = twoColAspectRatios.current.indexOf(twoColMinValue)
          twoCols.current[twoColIndex].push(photo)
          twoColAspectRatios.current[twoColIndex] += photo.height / photo.width

          oneCol.current.push(photo)
        })
      handleResize()
    }

    function handleResize() {
      if (matchMedia("(min-width: 1024px)").matches) {
        setFirstColPhotos(threeCols.current[0])
        setSecondColPhotos(threeCols.current[1])
        setThirdColPhotos(threeCols.current[2])
      } else if (matchMedia("(min-width: 640px)").matches) {
        setFirstColPhotos(twoCols.current[0])
        setSecondColPhotos(twoCols.current[1])
        setThirdColPhotos([])
      } else {
        setFirstColPhotos(oneCol.current)
        setSecondColPhotos([])
        setThirdColPhotos([])
      }
    }
    addEventListener("resize", handleResize)
    return () => {
      removeEventListener("resize", handleResize)
    }
  }, [data])

  return (
    <>
      {status === "success" ? (
        <div className="sm:px-6 pb-4 sm:pb-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6">
          {firstColPhotos.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {firstColPhotos.map(({ key, src, alt, width, height }, i) => (
                <Image
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  onLoad={
                    i === firstColPhotos.length - 1 && canFetchMore
                      ? () => {
                          fetchMore()
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
          {secondColPhotos.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {secondColPhotos.map(({ key, src, alt, width, height }) => (
                <Image
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              ))}
            </div>
          )}
          {thirdColPhotos.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
              {thirdColPhotos.map(({ key, src, alt, width, height }) => (
                <Image
                  key={key}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
