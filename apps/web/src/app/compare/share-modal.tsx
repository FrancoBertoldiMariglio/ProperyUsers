'use client'

import type { JSX } from 'react'
import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalTrigger,
  Button,
} from '@propery/ui/web'
import { Share2, Copy, Check, MessageCircle, Mail, Link2 } from 'lucide-react'

interface ShareModalProps {
  url: string
  propertyCount: number
}

export function ShareModal({ url, propertyCount }: ShareModalProps): JSX.Element {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareText = `Mira esta comparación de ${propertyCount} propiedades en Propery`

  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}: ${url}`)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent('Comparación de propiedades - Propery')}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ]

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Compartir
        </Button>
      </ModalTrigger>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>Compartir comparación</ModalTitle>
          <ModalDescription>
            Comparte esta comparación de {propertyCount} propiedades con quien quieras.
          </ModalDescription>
        </ModalHeader>

        {/* Copy link section */}
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 truncate bg-transparent text-sm outline-none"
          />
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="mr-1 h-4 w-4 text-green-500" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </div>

        {/* Share options */}
        <div className="flex gap-3 pt-2">
          {shareOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors ${option.color}`}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </a>
          ))}
        </div>

        <ModalFooter className="sm:justify-start">
          <p className="text-xs text-muted-foreground">
            El link incluye las propiedades seleccionadas. Cualquiera con el link puede
            ver la comparación.
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
