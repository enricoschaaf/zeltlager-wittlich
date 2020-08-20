import { DetailedHTMLProps, ImgHTMLAttributes } from "react"

export const Image = ({
  key,
  src,
  alt,
  width,
  height,
  onLoad,
}: DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) => {
  return (
    <div key={key} className="bg-gray-100">
      <img
        sizes="(min-width: 1024px) calc(calc(100vw - 6rem) / 3), (min-width: 768px) calc(calc(100vw - 4.5rem) / 2), 100vw"
        srcSet={`${src}?q=60&w=100 100w, ${src}?q=60&w=200 200w, ${src}?q=60&w=300 300w, ${src}?q=60&w=400 400w, ${src}?q=60&w=500 500w, ${src}?q=60&w=600 600w, ${src}?q=60&w=700 700w, ${src}?q=60&w=800 800w, ${src}?q=60&w=900 900w, ${src}?q=60&w=1000 1000w, ${src}?q=60&w=1100 1100w, ${src}?q=60&w=1200 1200w, ${src}?q=60&w=1300 1300w, ${src}?q=60&w=1400 1400w, ${src}?q=60&w=1500 1500w,`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={onLoad}
      />
    </div>
  )
}
