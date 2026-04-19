"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof Button>
type LinkProps = ComponentProps<typeof Link>

interface ButtonLinkProps extends Omit<ButtonProps, "render" | "nativeButton"> {
  href: LinkProps["href"]
  target?: string
  rel?: string
}

export function ButtonLink({ href, target, rel, children, ...props }: ButtonLinkProps) {
  return (
    <Button
      {...props}
      nativeButton={false}
      render={<Link href={href} target={target} rel={rel} />}
    >
      {children}
    </Button>
  )
}
