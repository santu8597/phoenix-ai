"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  RocketIcon,
  Cloud,
  ImageIcon,
  RefreshCw,
  Mail,
  Globe,
  Plane,
  Youtube,
  Search,
  Music,
  Wand2,
  Calendar,
  Heart,
  Hotel,
  DollarSign,
  Wallet,
  Users,
} from "lucide-react"
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { JSX } from "react"

const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyAVQpop5MJZpJg2x3DhEfWs4nCFmOQ-Op0",
})

interface SystemPromptEditorProps {
  systemPrompt: string
  onSystemPromptChange: (prompt: string) => void
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  onApplyConfig: (config: ConfigOptions) => void
  handleOpenDeployModal: () => void
  temperature?: number
  onTemperatureChange?: (temperature: number) => void
  topK?: number
  onTopKChange?: (topK: number) => void
  selectedModel?: string
  onSelectedModelChange?: (model: string) => void
}

interface ConfigOptions {
  temperature: number
  topK: number
  selectedModel: string
  selectedTools: string[]
  systemPrompt: string
}

interface ToolCategory {
  name: string
  tools: Tool[]
}

interface Tool {
  id: string
  name: string
  icon: JSX.Element
  description: string
}

export default function SystemPromptEditor({
  systemPrompt,
  onSystemPromptChange,
  selectedTools,
  onToolsChange,
  onApplyConfig,
  handleOpenDeployModal,
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,

  selectedModel,
  onSelectedModelChange
}: SystemPromptEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  // const [currentTemperature, setCurrentTemperature] = useState(temperature)
  // const [currentTopK, setCurrentTopK] = useState(topK)
  // const [currentModel, setCurrentModel] = useState(selectedModel)
  const [activeTab, setActiveTab] = useState("communication")

  const handleAiGenerate = async () => {
    setIsGenerating(true)
    const { text } = await generateText({
      model: google(selectedModel || "gemini-2.0-flash"),
      temperature: temperature || 0.5,
      topK: topK || 40,
      prompt: `generate a system prompt for an AI that can use the following tools: ${selectedTools.join(", ")}. The system prompt should be and enhance the AI's ability to use the tools effectively. The system prompt should be in a rich format. Use the following system prompt as a base: ${systemPrompt}.**keep the system prompt medium and descriptive**
      remove the markdown formatting and return only the system prompt.
      ->use multiple tools if needed
      `,
    })
    setIsGenerating(false)
    onSystemPromptChange(text)
  }

  // const handleApplyConfig = () => {
  //   onApplyConfig({
  //     temperature: currentTemperature,
  //     topK: currentTopK,
  //     selectedModel: currentModel,
  //     selectedTools,
  //     systemPrompt,
  //   })
  // }

  const toolCategories: ToolCategory[] = [
    {
      name: "communication",
      tools: [
        {
          id: "sendEmail",
          name: "Send Email",
          icon: <Mail className="h-4 w-4 mr-2" />,
          description: "Send emails to contacts",
        },
        {
          id: "readEmail",
          name: "Read Email",
          icon: <Mail className="h-4 w-4 mr-2" />,
          description: "Read emails from inbox",
        },
      ],
    },
    {
      name: "web",
      tools: [
        { id: "webSearch", name: "Browser", icon: <Globe className="h-4 w-4 mr-2" />, description: "Search the web" },
        {
          id: "scrapeDocsTool",
          name: "Web Scraper",
          icon: <Search className="h-4 w-4 mr-2" />,
          description: "Extract data from websites",
        },
        {
          id: "fetchYouTubeVideo",
          name: "YouTube",
          icon: <Youtube className="h-4 w-4 mr-2" />,
          description: "Search and fetch YouTube videos",
        },
      ],
    },
    {
      name: "utilities",
      tools: [
        {
          id: "getWeather",
          name: "Weather",
          icon: <Cloud className="h-4 w-4 mr-2" />,
          description: "Get weather forecasts",
        },
        {
          id: "generateImage",
          name: "Image Generation",
          icon: <ImageIcon className="h-4 w-4 mr-2" />,
          description: "Generate images from text",
        },
        {
          id: "musicMood",
          name: "Music Mood",
          icon: <Music className="h-4 w-4 mr-2" />,
          description: "Generate music based on mood",
        },
      ],
    },
    {
      name: "travel",
      tools: [
        {
          id: "fetchFlightDetails",
          name: "Flight",
          icon: <Plane className="h-4 w-4 mr-2" />,
          description: "Search for flight information",
        },
        {
          id: "fetchHotelDetails",
          name: "Hotel",
          icon: <Hotel className="h-4 w-4 mr-2" />,
          description: "Find hotel accommodations",
        },
      ],
    },
    {
      name: "finance",
      tools: [
        {
          id: "nftTool",
          name: "NFT",
          icon: <Wallet className="h-4 w-4 mr-2" />,
          description: "Manage NFT transactions",
        },
        {
          id: "MoneySendTool",
          name: "Send Money",
          icon: <DollarSign className="h-4 w-4 mr-2" />,
          description: "Send money to contacts",
        },
        {
          id: "distributePaymentTool",
          name: "Distribute Money",
          icon: <Users className="h-4 w-4 mr-2" />,
          description: "Split payments among multiple recipients",
        },
      ],
    },
    {
      name: "personal",
      tools: [
        {
          id: "googleCalendarManager",
          name: "Calendar",
          icon: <Calendar className="h-4 w-4 mr-2" />,
          description: "Manage calendar events",
        },
        {
          id: "fetchDoctors",
          name: "Find Doctors",
          icon: <Heart className="h-4 w-4 mr-2" />,
          description: "Find healthcare providers",
        },
      ],
    },
  ]

  const handleToolToggle = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onToolsChange(selectedTools.filter((id) => id !== toolId))
    } else {
      onToolsChange([...selectedTools, toolId])
    }
  }

  const googleModels = [
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="model-selector">Model</Label>
        <Select value={selectedModel} onValueChange={onSelectedModelChange}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {googleModels.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="temperature">Temperature: {temperature?.toFixed(2)}</Label>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.01}
            value={[temperature || 0.5]}
            onValueChange={(value) => onTemperatureChange(value[0])}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="topk">Top K: {topK}</Label>
          </div>
          <Slider
            id="topk"
            min={1}
            max={100}
            step={1}
            value={[topK || 40]}
            onValueChange={(value) => onTopKChange(value[0])}
            
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <div className="flex gap-2 mb-2">
          <Button className="w-full" disabled={isGenerating} onClick={handleAiGenerate}>
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                Generate Prompt <Wand2 className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
        <Label htmlFor="system-prompt">System Prompt</Label>

        <Textarea
          id="system-prompt"
          placeholder="Enter system instructions for the AI..."
          className="mt-1 min-h-[150px]"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Available Tools</Label>
          <span className="text-xs text-gray-500">{selectedTools.length} selected</span>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            {toolCategories.map((category) => (
              <TabsTrigger key={category.name} value={category.name} className="text-xs">
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {toolCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="mt-0">
              <div className="grid grid-cols-1 gap-1 border rounded-md p-2 max-h-[200px] overflow-y-auto">
                {category.tools.map((tool) => (
                  <div key={tool.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-md">
                    <Checkbox
                      id={tool.id}
                      checked={selectedTools.includes(tool.id)}
                      onCheckedChange={() => handleToolToggle(tool.id)}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor={tool.id} className="flex items-center cursor-pointer font-medium">
                        {tool.icon}
                        {tool.name}
                      </Label>
                      <p className="text-xs text-gray-500 ml-6">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={onApplyConfig} className="flex-1" variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          Apply Configuration
        </Button>
        <Button onClick={handleOpenDeployModal} className="flex items-center" variant="outline">
          <RocketIcon className="h-4 w-4 mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  )
}
