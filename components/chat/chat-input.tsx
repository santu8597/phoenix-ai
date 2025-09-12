"use client"

import type React from "react"
import type { RefObject } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Send, Loader2, Paperclip, Mic, MicOff } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  files: FileList | undefined
  formRef: RefObject<HTMLFormElement | null>
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  // Add voice-related props
  isRecording: boolean
  isListening: boolean
  speechSupported: boolean
  handleVoiceToggle: () => void
}

export default function ChatInput({
  input,
  handleInputChange,
  onSubmit,
  isLoading,
  files,
  formRef,
  fileInputRef,
  handleFileChange,
  isRecording,
  isListening,
  speechSupported,
  handleVoiceToggle,
}: ChatInputProps) {
  return (
    <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
      <form ref={formRef} onSubmit={onSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          <div className="flex absolute left-2 bottom-4 gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5 text-white" />
              <span className="sr-only">Upload file</span>
            </Button>

            {speechSupported && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={`h-8 w-8 transition-colors ${
                  isRecording
                    ? "text-red-500 hover:text-red-600 animate-pulse"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={handleVoiceToggle}
                disabled={isLoading}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span className="sr-only">{isRecording ? "Stop recording" : "Start voice input"}</span>
              </Button>
            )}
          </div>

          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (input.trim() || (files && files.length > 0)) {
                  formRef.current?.requestSubmit()
                }
              }
            }}
            placeholder={isListening ? "Listening... Speak now" : "Type a message... (Shift+Enter for new line)"}
            className={`pl-20 pr-12 py-4 border-muted bg-background/50 focus-visible:ring-primary/50 transition-all duration-300 w-full rounded-md resize-none min-h-[56px] max-h-[200px] overflow-y-auto ${
              isListening ? "border-red-300 bg-red-50/10" : ""
            }`}
            rows={input.split("\n").length > 3 ? 3 : input.split("\n").length || 1}
            disabled={isListening}
          />

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-4 h-8 w-8 bg-primary hover:bg-primary/90 transition-colors"
              disabled={isLoading || (!input && (!files || files.length === 0)) || isListening}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </motion.div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,application/pdf,audio/*,video/*"
          className="hidden"
        />
      </form>

      {isListening && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-red-400">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording... Click the microphone to stop
          </div>
        </motion.div>
      )}

      {!speechSupported && (
        <p className="text-xs text-muted-foreground mt-2 text-center opacity-60">
          Voice input requires a modern browser with speech recognition support
        </p>
      )}
    </div>
  )
}
