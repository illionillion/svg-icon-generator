"use client";
import { Button, Center, Container, Image, Input, InputGroup } from "@yamada-ui/react"
import { useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const copyInputRef = useRef<HTMLInputElement>(null)
  const [md, setMd] = useState<string>('')
  const [iconUrl, setIconUrl] = useState<string>('')
  const handleOnClick = async () => {
    if (!inputRef.current) return
    const username = inputRef.current.value
    const response = await fetch(`/api/?username=${username}`)
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob);
    setMd(`![${username}](${window.location.href}api/?username=${username})`)
    setIconUrl(imageUrl);
  }
  const handleCopy = () => {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(md)
    } else {
      if (copyInputRef.current) {
        copyInputRef.current.select()
      }
    }
  }

  return (
    <>
      <Container>
        <InputGroup>
          <Input placeholder="Enter your username." ref={inputRef} />
          <Button onClick={handleOnClick}>Generate</Button>
        </InputGroup>
        <Center>
          {!!iconUrl && <Image src={iconUrl} w="fit-content" h="fit-content" objectFit="contain" />}
        </Center>
        <InputGroup>
          <Input type='text' value={md} readOnly ref={copyInputRef} />
          <Button onClick={handleCopy} isDisabled={!iconUrl}>Copy</Button>
        </InputGroup>
      </Container>
    </>
  )
}
