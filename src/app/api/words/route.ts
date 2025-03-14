import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { Word, WordRequest, Profession } from '../../types/types';
import { generatePrompt, mergeWordsWithSentences } from '../../utils/wordUtils';

// OpenAI 客户端配置
// 使用环境变量配置 API 密钥和基础 URL
const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
});

// 定义每个请求批次处理的单词数量
// 将单词分成小块处理可以：
// 1. 提高响应速度
// 2. 避免超出 API 限制
// 3. 优化并发处理
const CHUNK_SIZE = 5;

/**
 * 处理单个单词分块的函数
 * @param words - 待处理的单词数组
 * @param profession - 职业信息
 * @returns 包含职业信息和 AI 响应的对象
 */
async function processWordChunk(words: Word[], profession: Profession) {
  // 性能监控：记录处理开始时间
  const startTime = performance.now();
  // 创建唯一的时间标签，避免并发请求时标签冲突
  const timeLabel = `processWordChunk-${profession.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  console.time(timeLabel);

  // 根据单词和职业生成提示词
  const prompt = generatePrompt(words, profession);
  // 调用 OpenAI API 生成例句
  const completion = await client.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'o3-mini',
    response_format: { type: 'json_object' }, // 指定返回 JSON 格式
  });

  // 验证 API 响应
  const aiResponse = completion.choices[0].message.content;
  if (!aiResponse) {
    throw new Error('No response from OpenAI');
  }

  // 性能监控：记录处理结束时间并输出统计信息
  const endTime = performance.now();
  console.timeEnd(timeLabel);
  console.log(`处理职业 ${profession.id} 的耗时: ${(endTime - startTime).toFixed(2)}ms`);

  return { profession, aiResponse };
}

/**
 * POST 请求处理函数
 * 处理流程：
 * 1. 接收单词列表和职业列表
 * 2. 将单词分块并行处理
 * 3. 合并处理结果
 * 4. 返回带有例句的单词列表
 */
export async function POST(req: NextRequest) {
  try {
    // 解析请求体
    const { professions, words } = (await req.json()) as WordRequest;

    // 输入验证：确保职业和单词列表非空
    if (!professions?.length || !words?.length) {
      return NextResponse.json(
        { error: 'Invalid request: professions and words must be non-empty arrays' },
        { status: 400 }
      );
    }

    // 初始化响应数组：为每个单词创建一个 Map 存储不同职业场景的例句
    const responseWords = words.map(word => ({
      ...word,
      sentences: new Map<string, string>(),
    }));

    // 将单词列表分块，每块 CHUNK_SIZE 个单词
    const wordChunks: Word[][] = [];
    for (let i = 0; i < words.length; i += CHUNK_SIZE) {
      wordChunks.push(words.slice(i, i + CHUNK_SIZE));
    }

    // 并行处理策略：
    // 1. 对每个单词分块
    // 2. 对每个职业
    // 3. 创建处理任务
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

    // 等待所有并行任务完成
    const results = await Promise.all(allPromises.map(({ promise }) => promise));

    // 错误处理和结果合并
    const errors = [];
    for (const result of results) {
      if ('error' in result) {
        // 记录错误信息但继续处理其他结果
        errors.push(`Error processing chunk for ${result.profession.id}: ${result.error.message}`);
        continue;
      }
      // 将生成的例句合并到响应数组中
      mergeWordsWithSentences(responseWords, result.aiResponse, result.profession);
    }

    // 错误日志记录
    if (errors.length > 0) {
      console.error('Some chunks failed:', errors);
    }

    // 序列化响应：将 Map 转换为普通对象以便 JSON 序列化
    const serializedResponse = {
      words: responseWords.map(word => ({
        ...word,
        sentences: Object.fromEntries(word.sentences)
      }))
    };

    return NextResponse.json(serializedResponse);
  } catch (error) {
    // 全局错误处理
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}