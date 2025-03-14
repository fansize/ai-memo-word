import { Profession, Word, DictionaryEntry } from '../types/types';

/**
 * 创建空的例句映射
 * 用于初始化单词的例句存储结构
 * 返回一个新的 Map 对象，key 为职业 ID，value 为对应的例句
 */
function createEmptySentences(): Map<string, string> {
  return new Map<string, string>();
}

/**
 * 从词典数据中获取指定章节的单词列表
 * @param data - 完整的词典数据数组
 * @param chapter - 章节编号（从 1 开始）
 * @returns 当前章节的单词数组，每个单词包含完整的单词信息
 * 
 * 业务规则：
 * 1. 每章固定 20 个单词
 * 2. 根据章节号计算起始索引
 * 3. 转换词典条目为标准单词对象格式
 */
export function getWordsFromChapter(data: DictionaryEntry[], chapter: number): Word[] {
  const wordsPerChapter = 20; // 每章单词数量
  const startIndex = (chapter - 1) * wordsPerChapter; // 计算起始索引
  const endIndex = startIndex + wordsPerChapter; // 计算结束索引
  
  return data.slice(startIndex, endIndex).map(entry => ({
    word: entry.name,      // 单词
    trans: entry.trans,    // 翻译
    usphone: entry.usphone, // 美式音标
    ukphone: entry.ukphone, // 英式音标
    sentences: createEmptySentences(), // 初始化空的例句映射
  }));
}

/**
 * 生成 AI 提示词
 * @param words - 需要生成例句的单词数组
 * @param profession - 职业信息对象
 * @returns 格式化的提示词字符串
 * 
 * 功能说明：
 * 1. 根据给定的单词列表和职业背景生成 AI 提示词
 * 2. 提示词包含具体的要求和格式说明
 * 3. 要求 AI 生成符合特定职业场景的例句
 * 
 * 验证规则：
 * 1. 确保职业信息完整
 * 2. 验证单词数据有效性
 * 3. 过滤无效单词
 */
export function generatePrompt(words: Word[], profession: Profession): string {
  // Validate profession
  if (!profession) {
    throw new Error('Invalid profession: profession object is required');
  }
  if (!profession.id) {
    throw new Error(`Invalid profession: name is required, got ${JSON.stringify(profession)}`);
  }

  // Validate and extract word strings
  const wordStrings = words.map(w => {
    if (!w || !w.word) {
      throw new Error('Invalid word object: word property is required');
    }
    return w.word;
  }).filter(Boolean); // Remove any undefined/null values

  if (wordStrings.length === 0) {
    throw new Error('No valid words provided');
  }


  return `You are a language learning assistant. I need you to create memorable example sentences for English vocabulary words.

  Professional Context:
  ${profession.id} (${profession.description})

  Requirements:
  1. For each word, create a sentence that naturally incorporates the word in the context of ${profession.id}'s work environment
  2. Make sentences moderately difficult - not too simple, not too complex
  3. Use everyday expressions and relatable scenarios that professionals encounter
  4. Create sentences that help learners remember the word through practical usage
  5. Connect the sentences to common workplace situations or daily professional activities
  6. Focus on practical language that would actually be used in this professional context
  7. Ensure sentences feel natural and conversational, not academic or textbook-like

  Words to create sentences for:
  ${wordStrings.map(w => `"${w}"`).join(', ')}

  Format the response as a JSON object with this structure:
  {
    "data": [
      {
        "word": "example",
        "sentences": "The software developer created an example to demonstrate how the new feature works in real-world scenarios."
      },
      // more words with sentences
    ]
  }
`;
}

/**
 * 合并 AI 生成的例句到单词对象中
 * @param words - 需要更新的单词数组
 * @param aiResponse - AI 返回的 JSON 格式例句
 * @param profession - 职业信息对象
 * 
 * 处理流程：
 * 1. 解析 AI 响应数据
 * 2. 匹配单词和对应的例句
 * 3. 将例句存储到单词对象的 sentences Map 中
 * 
 * 错误处理：
 * 1. 验证输入参数完整性
 * 2. 检查 AI 响应格式
 * 3. 处理单词匹配异常
 * 4. 记录处理过程中的错误
 */
export function mergeWordsWithSentences(words: Word[], aiResponse: string, profession: Profession) {
  // Validate inputs
  if (!words || !Array.isArray(words)) {
    throw new Error('Invalid words: must be an array');
  }

  if (!profession || !profession.id) {
    throw new Error('Invalid profession: id is required');
  }

  if (!aiResponse) {
    throw new Error('Invalid aiResponse: response is required');
  }
  
  try {
    // 解析 AI 响应
    const parsedResponse = JSON.parse(aiResponse);
    if (!parsedResponse.data || !Array.isArray(parsedResponse.data)) {
      throw new Error('Invalid AI response format: data array is missing');
    }

    // 提取例句数据并类型转换
    const sentencesData = parsedResponse.data as Array<{ word: string; sentences: string }>;
  
    // 遍历单词数组，匹配并存储例句
    words.map(word => {
      if (!word || !word.word) {
        console.warn('Invalid word object:', word);
      }

      // 查找匹配的例句并存储
      const matchingSentence = sentencesData.find(s => s.word === word.word);
      if (matchingSentence && matchingSentence.sentences) {
        word.sentences.set(profession.id, matchingSentence.sentences);
      }
    });
  } catch (error) {
    console.error('Error merging words with sentences:', error);
  }
}