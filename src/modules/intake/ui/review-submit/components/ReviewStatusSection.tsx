"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export function ReviewStatusSection() {
  return (
    <Card className="w-full rounded-2xl shadow-md mb-6 border-green-200 bg-green-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle className="h-6 w-6" />
          <span className="font-medium">All required information has been completed</span>
        </div>
      </CardContent>
    </Card>
  )
} 