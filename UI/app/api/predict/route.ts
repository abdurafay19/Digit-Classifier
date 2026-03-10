import { NextRequest, NextResponse } from "next/server"

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as Blob | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Forward the file to FastAPI backend
    const fastApiForm = new FormData()
    fastApiForm.append("file", file, "digit.png")

    const response = await fetch(`${FASTAPI_URL}/predict`, {
      method: "POST",
      body: fastApiForm,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("FastAPI error:", errorText)
      return NextResponse.json(
        { error: "Prediction failed" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Failed to connect to prediction server" },
      { status: 500 }
    )
  }
}
