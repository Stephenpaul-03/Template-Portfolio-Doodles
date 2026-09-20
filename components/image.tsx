import type { ImgHTMLAttributes } from "react"
import { assetPath } from "@/lib/asset-path"

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function Image({ fill, priority, ...props }: ImageProps) {
  return <img {...props} src={props.src ? assetPath(props.src) : props.src} loading={priority ? "eager" : "lazy"} className={`${fill ? "scrap-image-fill" : ""} ${props.className ?? ""}`.trim()} />
}
