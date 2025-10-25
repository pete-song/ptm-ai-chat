import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadExcelData, formatExcelDataForAI } from "@/lib/excel-utils";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Use the provided API key or fallback to the hardcoded one
    const apiKey = process.env.GOOGLE_AI_API_KEY || "AIzaSyAg0OlN9GcySioP-tApcRPF8U6lgINud6I";
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    // Load Excel data for context
    let excelContext = "";
    try {
      const excelData = await loadExcelData();
      excelContext = formatExcelDataForAI(excelData);
    } catch (error) {
      console.error('Error loading Excel data:', error);
      excelContext = "Excel data temporarily unavailable.";
    }

    const systemPrompt = `You are PTM AI, a helpful assistant for Patong Mart. You have access to data from P5.xlsx file that you can reference when answering questions.

${excelContext}

When users ask questions about data, products, or information that might be in the Excel file, use this data to provide accurate answers. If the information isn't available in the provided data, let the user know and offer to help with other questions.

Be helpful, concise, and professional in your responses.`;

    // Get the Gemini model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build the conversation history for Gemini
    const conversationText = conversationHistory 
      ? conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n') + '\n'
      : '';

    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationText}User: ${message}`;

    const result = await model.generateContent(fullPrompt);
    const response_text = result.response.text();

    const response = {
      message: response_text || "Sorry, I couldn't generate a response.",
      conversationId: Date.now().toString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing chat request:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: "Failed to process chat request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
