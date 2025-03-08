import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { Word, WordRequest, Profession } from '../../types/types';
import { generatePrompt, mergeWordsWithSentences } from '../../utils/wordUtils';

// 初始化 OpenAI 客户端
const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

// 单词分块大小
const CHUNK_SIZE = 5;

// 处理单个分块的单词
// 将函数改为导出
async function processWordChunk(words: Word[], profession: Profession) {
  const startTime = performance.now();
  // 添加唯一标识符避免标签重复
  const timeLabel = `processWordChunk-${profession.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  console.time(timeLabel);

  const prompt = generatePrompt(words, profession);
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'o3-mini',
    response_format: { type: 'json_object' },
  });

  const aiResponse = completion.choices[0].message.content;
  if (!aiResponse) {
    throw new Error('No response from OpenAI');
  }

  const endTime = performance.now();
  console.timeEnd(timeLabel);
  console.log(`处理职业 ${profession.id} 的耗时: ${(endTime - startTime).toFixed(2)}ms`);

  return { profession, aiResponse };
}

export async function POST(req: NextRequest) {
  try {
    const { professions, words } = (await req.json()) as WordRequest;

    // 验证输入
    if (!professions?.length || !words?.length) {
      return NextResponse.json(
        { error: 'Invalid request: professions and words must be non-empty arrays' },
        { status: 400 }
      );
    }

    // 初始化响应数组
    const responseWords = words.map(word => ({
      ...word,
      sentences: new Map<string, string>(),
    }));

    // 将单词分块
    const wordChunks: Word[][] = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      wordChunks.push(words.slice(i, i + CHUNK_SIZE));
    }

    // 并行处理所有分块和职业
    const allPromises = wordChunks.flatMap(chunk =>
      professions.map(profession => ({
        chunk,
        promise: processWordChunk(chunk, profession)
          .catch(error => ({
            error,
            chunk,
            profession,
          }))
      }))
    );

    // 等待所有请求完成
    const results = await Promise.all(allPromises.map(({ promise }) => promise));

    // 处理错误和成功的结果
    const errors = [];
    for (const result of results) {
      if ('error' in result) {
        errors.push(`Error processing chunk for ${result.profession.id}: ${result.error.message}`);
        continue;
      }
      mergeWordsWithSentences(responseWords, result.aiResponse, result.profession);
    }

    // 如果有错误，记录到响应中
    if (errors.length > 0) {
      console.error('Some chunks failed:', errors);
    }

    // 序列化响应
    const serializedResponse = {
      words: responseWords.map(word => ({
        ...word,
        sentences: Object.fromEntries(word.sentences)
      }))
    };

    return NextResponse.json(serializedResponse);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}