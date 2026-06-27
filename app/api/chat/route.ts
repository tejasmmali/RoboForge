import { NextResponse } from "next/server";
import { z } from "zod";
import {
  classifyGeminiError,
  sendToGemini,
  streamFromGemini,
} from "@/lib/ai/gemini";
import {
  buildSystemInstruction,
  detectPromptInjection,
  sanitizeUserInput,
} from "@/lib/ai/prompt";
import type { ChatApiRequest, ChatStreamEvent } from "@/types/chat";

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(
    z.object({
      text: z.string().max(4000),
    }),
  ),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(100),
  projectContext: z
    .object({
      projectSlug: z.string(),
      projectName: z.string(),
      description: z.string().optional(),
      difficulty: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      components: z.array(z.string()).optional(),
      currentStep: z
        .object({
          number: z.number(),
          title: z.string(),
          content: z.string().optional(),
        })
        .optional(),
      progressPercent: z.number().optional(),
      programming: z.string().optional(),
      powerSource: z.string().optional(),
    })
    .optional(),
  memoryContext: z
    .object({
      favoriteComponents: z.array(z.string()).optional(),
      recentProjects: z.array(z.string()).optional(),
      learningProgress: z.string().optional(),
    })
    .optional(),
  settings: z
    .object({
      temperature: z.number().min(0).max(1).optional(),
      responseLength: z.enum(["concise", "balanced", "detailed"]).optional(),
    })
    .optional(),
  stream: z.boolean().optional(),
});

function sanitizeMessages(
  messages: z.infer<typeof requestSchema>["messages"],
) {
  return messages.map((message, index) => {
    const isLastUser =
      index === messages.length - 1 && message.role === "user";
    const text = message.parts
      .map((part) =>
        isLastUser ? sanitizeUserInput(part.text) : part.text.slice(0, 4000),
      )
      .join("\n");

    return {
      role: message.role,
      parts: [{ text }],
    };
  });
}

function createSseStream(body: ChatApiRequest) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const send = (event: ChatStreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      try {
        const lastUser = body.messages.at(-1);
        const lastText = lastUser?.parts[0]?.text ?? "";

        if (detectPromptInjection(lastText)) {
          send({
            type: "chunk",
            text:
              "I can only help with robotics and engineering topics. Please ask about your project, wiring, code, or components.",
          });
          send({ type: "done", finishReason: "STOP" });
          controller.close();
          return;
        }

        const systemInstruction = buildSystemInstruction({
          projectContext: body.projectContext,
          memoryContext: body.memoryContext,
          responseLength: body.settings?.responseLength,
          temperature: body.settings?.temperature,
        });

        let fullText = "";

        for await (const chunk of streamFromGemini({
          messages: sanitizeMessages(body.messages),
          systemInstruction,
        })) {
          fullText += chunk;
          send({ type: "chunk", text: chunk });
        }

        if (!fullText.trim()) {
          send({
            type: "error",
            error: {
              code: "empty",
              message: "The AI returned an empty response.",
            },
          });
        } else {
          send({ type: "done", finishReason: "STOP" });
        }
      } catch (error) {
        const classified = classifyGeminiError(error);
        send({ type: "error", error: classified });
      } finally {
        controller.close();
      }
    },
  });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "unknown",
            message: "Invalid request. Check your message format.",
          },
        },
        { status: 400 },
      );
    }

    const body = parsed.data as ChatApiRequest;
    const last = body.messages.at(-1);

    if (!last || last.role !== "user") {
      return NextResponse.json(
        {
          error: {
            code: "unknown",
            message: "Last message must be from the user.",
          },
        },
        { status: 400 },
      );
    }

    if (body.stream) {
      const stream = createSseStream(body);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const lastText = last.parts[0]?.text ?? "";

    if (detectPromptInjection(lastText)) {
      return NextResponse.json({
        text: "I can only help with robotics and engineering topics. Please ask about your project, wiring, code, or components.",
        finishReason: "STOP",
      });
    }

    const systemInstruction = buildSystemInstruction({
      projectContext: body.projectContext,
      memoryContext: body.memoryContext,
      responseLength: body.settings?.responseLength,
      temperature: body.settings?.temperature,
    });

    const response = await sendToGemini({
      messages: sanitizeMessages(body.messages),
      systemInstruction,
    });

    if (!response.text.trim()) {
      return NextResponse.json(
        {
          error: {
            code: "empty",
            message: "The AI returned an empty response.",
          },
        },
        { status: 502 },
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    const classified = classifyGeminiError(error);
    const status =
      classified.code === "rate_limit"
        ? 429
        : classified.code === "invalid_key"
          ? 401
          : 500;

    return NextResponse.json({ error: classified }, { status });
  }
}
