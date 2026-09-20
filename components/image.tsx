import type { ImgHTMLAttributes } from "react"

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function Image({ fill, priority, ...props }: ImageProps) {
  return <img {...props} loading={priority ? "eager" : "lazy"} className={`${fill ? "scrap-image-fill" : ""} ${props.className ?? ""}`.trim()} />
}
