"use client";
import { Button, Center, Checkbox, Container, Image, Input, InputGroup, InputLeftAddon, InputRightAddon } from "@yamada-ui/react"
import { useRef, useState } from "react";

export default function Home() {
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const sizeInputRef = useRef<HTMLInputElement>(null)
  const copyInputRef = useRef<HTMLInputElement>(null)
  const bgColorInputRef = useRef<HTMLInputElement>(null)
  const isCircleCheckBoxRef = useRef<HTMLInputElement>(null)
  const [md, setMd] = useState<string>('')
  const [iconUrl, setIconUrl] = useState<string>('')
  const handleOnClick = async () => {
    if (!usernameInputRef.current
      || usernameInputRef.current.value === ''
      || !sizeInputRef.current
      || !bgColorInputRef.current
      || !isCircleCheckBoxRef.current
    ) return
    const username = usernameInputRef.current.value
    const size = sizeInputRef.current.value
    const bgColor = bgColorInputRef.current.value
    const isCircle = isCircleCheckBoxRef.current.checked
    const apiURL = `api/?username=${username}${size ? `&size=${size}` : ''}${bgColor ? `&bgColor=${encodeURIComponent(bgColor)}` : ''}&isCircle=${isCircle}`
    const response = await fetch(`/${apiURL}`)
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob);
    setMd(`![${username}](${window.location.href + apiURL})`)
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
          <Input type="text" placeholder="Enter your GitHub username." ref={usernameInputRef} />
          <Button onClick={handleOnClick}>Generate</Button>
        </InputGroup>
        <InputGroup>
          <Input type="number" placeholder="Enter Icon Size." ref={sizeInputRef} />
          <InputRightAddon>px</InputRightAddon>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>bgColor</InputLeftAddon>
          <Input type="color" defaultValue="#f0f0f0" ref={bgColorInputRef} />
        </InputGroup>
        <Checkbox ref={isCircleCheckBoxRef}>is Circle</Checkbox>
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
